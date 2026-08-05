/**
 * Synchronization engine.
 *
 * Coordinates synchronization between Trinity's local storage and Supabase.
 * This is the only module that communicates with both persistence layers:
 *   IndexedDB  ⇄  sync.ts  ⇄  Supabase
 *
 * Responsibilities:
 * - Prevent concurrent synchronization attempts.
 * - Determine whether synchronization is currently possible.
 * - Upload local changes to Supabase.
 * - Download remote changes from Supabase.
 * - Mark successfully uploaded records as synchronized.
 *
 * This module intentionally contains no React code and should never
 * manipulate application state directly. React hooks should update the
 * local database first and then call `requestSync()`.
 */

import {
  ANCHORS_STORAGE_KEY,
  FASTING_PLAN_ID_STORAGE_KEY,
  FASTING_SESSION_STORAGE_KEY,
  PREFERRED_FAST_START_TIME_STORAGE_KEY,
  PROFILE_LAST_SYNCED_AT_STORAGE_KEY,
  PROFILE_NEEDS_SYNC_STORAGE_KEY,
  STREAK_STORAGE_KEY,
  TARGET_WEIGHT_KG_STORAGE_KEY,
  XP_STORAGE_KEY,
} from '@/constants/storage-keys'
import * as indexedDb from '@/lib/indexed-db'
import * as supabaseDb from '@/lib/supabase-db'
import { createClient } from '@/supabase/client'
import type { Tables, TablesUpdate } from '@/types/database'
import type { Fast } from '@/types/fasting'
import type { WeightEntry } from '@/types/weight'

/**
 * Whether a synchronization is currently in progress.
 */
let isSyncing = false

/**
 * Requests a synchronization.
 *
 * This is the public entry point used throughout the application.
 *
 * If a synchronization is already running, this function does nothing.
 * Otherwise, it starts a new synchronization.
 */
export const requestSync = async (): Promise<void> => {
  if (isSyncing) return
  isSyncing = true

  try {
    await sync()
  } finally {
    isSyncing = false
  }
}

/**
 * Performs a complete synchronization cycle.
 *
 * Synchronization always proceeds in two phases:
 *
 * 1. Upload pending local changes.
 * 2. Download remote changes.
 */
const sync = async (): Promise<void> => {
  if (!(await canSync())) return

  // This shouldn't be Promise.all.
  await uploadPendingChanges()
  await downloadRemoteChanges()
}

/**
 * Determines whether synchronization can currently proceed.
 *
 * Synchronization is skipped when there is no authenticated user.
 */
const canSync = async (): Promise<boolean> => {
  if (!navigator.onLine) return false

  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session !== null
}

/**
 * Uploads every locally modified record to Supabase.
 */
const uploadPendingChanges = async (): Promise<void> => {
  await Promise.all([
    uploadProfile(),
    uploadFasts(),
    uploadWeightEntries(),
    uploadPendingDeletes(),
  ])
}

/**
 * Downloads remote changes from Supabase.
 */
const downloadRemoteChanges = async (): Promise<void> => {
  await Promise.all([
    downloadProfile(),
    downloadFasts(),
    downloadWeightEntries(),
    downloadFastsDeletions(),
    downloadWeightEntriesDeletions(),
  ])
}

/**
 * Uploads the local profile to the cloud.
 */
const uploadProfile = async () => {
  const profileNeedsSync =
    localStorage.getItem(PROFILE_NEEDS_SYNC_STORAGE_KEY) === 'true'
  if (!profileNeedsSync) return

  const profile = await buildProfile()

  const syncedAt = new Date().toISOString()
  profile.last_synced_at = syncedAt

  await supabaseDb.updateProfile(profile)

  localStorage.setItem(PROFILE_LAST_SYNCED_AT_STORAGE_KEY, syncedAt)
  clearProfileNeedsSync()
}

/**
 * Uploads all locally modified fasts to Supabase.
 *
 * Records are uploaded using an upsert operation so both newly created
 * and previously existing fasts are synchronized with a single request.
 *
 * Successfully uploaded fasts are marked as synchronized locally.
 */
const uploadFasts = async (): Promise<void> => {
  const fasts: Fast[] = await indexedDb.getFasts()

  const fastsNeedingSync = fasts.filter((fast) => fast.needsSync === true)
  if (fastsNeedingSync.length === 0) return

  await supabaseDb.upsertFasts(fastsNeedingSync)

  // Every uploaded fast needs its needSync set to false.
  fastsNeedingSync.forEach((fast) => (fast.needsSync = false))

  // Persist the updated fasts back to IndexedDB.
  await Promise.all(fastsNeedingSync.map((fast) => indexedDb.updateFast(fast)))
}

/**
 * Uploads all locally modified weight entries to Supabase.
 *
 * Records are uploaded using an upsert operation so both newly created
 * and previously existing weight entries are synchronized with a single
 * request.
 *
 * Successfully uploaded entries are marked as synchronized locally.
 */
const uploadWeightEntries = async (): Promise<void> => {
  const weightEntries: WeightEntry[] = await indexedDb.getWeightEntries()

  const weightEntriesNeedingSync = weightEntries.filter(
    (entry) => entry.needsSync === true,
  )
  if (weightEntriesNeedingSync.length === 0) return

  await supabaseDb.upsertWeightEntries(weightEntriesNeedingSync)

  // Every uploaded weight entry needs its needSync set to false.
  weightEntriesNeedingSync.forEach((entry) => (entry.needsSync = false))

  // Persist the updated entry back to IndexedDB.
  await Promise.all(
    weightEntriesNeedingSync.map((entry) => indexedDb.updateWeightEntry(entry)),
  )
}

/**
 * Uploads all pending deletions.
 *
 * Each pending deletion is synchronized in three steps:
 *
 * 1. Delete the corresponding entity from Supabase.
 * 2. Create a deletion tombstone in Supabase.
 * 3. Remove the pending deletion from IndexedDB.
 *
 * If any step fails for a particular deletion, that deletion remains in the
 * local pending delete queue so it can be retried during the next
 * synchronization.
 */
const uploadPendingDeletes = async (): Promise<void> => {
  const pendingDeletes = await indexedDb.getPendingDeletes()
  if (pendingDeletes.length === 0) return

  for (const pendingDelete of pendingDeletes) {
    switch (pendingDelete.entity) {
      case 'fast': {
        await supabaseDb.deleteFast(pendingDelete.entityId)
        await supabaseDb.addFastDeletion(pendingDelete)
        break
      }

      case 'weightEntry': {
        await supabaseDb.deleteWeightEntry(pendingDelete.entityId)
        await supabaseDb.addWeightEntryDeletion(pendingDelete)
        break
      }
    }

    await indexedDb.removePendingDelete(pendingDelete.id)
  }
}

/**
 * Downloads the latest profile from Supabase.
 */
const downloadProfile = async () => {
  const remoteProfile = await supabaseDb.getProfile()

  const localLastSyncedAt = localStorage.getItem(
    PROFILE_LAST_SYNCED_AT_STORAGE_KEY,
  )

  if (
    remoteProfile.last_synced_at &&
    (!localLastSyncedAt || remoteProfile.last_synced_at > localLastSyncedAt)
  ) {
    applyProfile(remoteProfile)

    localStorage.setItem(
      PROFILE_LAST_SYNCED_AT_STORAGE_KEY,
      remoteProfile.last_synced_at,
    )

    clearProfileNeedsSync()
  }
}

/**
 * Downloads missing or newer fasts from Supabase.
 */
const downloadFasts = async (): Promise<void> => {
  const remoteFasts = await supabaseDb.getFasts()
  const localFasts = await indexedDb.getFasts()

  const localFastIds = new Set(localFasts.map((fast) => fast.id))

  const fastsNeedingDownload = remoteFasts.filter(
    (fast) => !localFastIds.has(fast.id),
  )
  if (fastsNeedingDownload.length === 0) return

  await Promise.all(fastsNeedingDownload.map((fast) => indexedDb.addFast(fast)))
}

/**
 * Downloads missing or newer weight entries from Supabase.
 */
const downloadWeightEntries = async (): Promise<void> => {
  const remoteWeightEntries = await supabaseDb.getWeightEntries()
  const localWeightEntries = await indexedDb.getWeightEntries()

  const localEntryIds = new Set(localWeightEntries.map((entry) => entry.id))

  const entriesNeedingDownload = remoteWeightEntries.filter(
    (entry) => !localEntryIds.has(entry.id),
  )
  if (entriesNeedingDownload.length === 0) return

  await Promise.all(
    entriesNeedingDownload.map((entry) => indexedDb.addWeightEntry(entry)),
  )
}

/**
 * Downloads deleted fast tombstones.
 *
 * Every downloaded tombstone represents a fast that no longer exists.
 * The corresponding local fast is removed if present.
 */
const downloadFastsDeletions = async (): Promise<void> => {
  const remoteDeletions = await supabaseDb.getFastsDeletions()
  if (remoteDeletions.length === 0) return

  await Promise.all(
    remoteDeletions.map((deletion) => indexedDb.deleteFast(deletion.entityId)),
  )
}

/**
 * Downloads deleted weight entry tombstones.
 *
 * Every downloaded tombstone represents a weight entry that no longer
 * exists. The corresponding local weight entry is removed if present.
 */
const downloadWeightEntriesDeletions = async (): Promise<void> => {
  const remoteDeletions = await supabaseDb.getWeightEntriesDeletions()
  if (remoteDeletions.length === 0) return

  await Promise.all(
    remoteDeletions.map((deletion) =>
      indexedDb.deleteWeightEntry(deletion.entityId),
    ),
  )
}

/**
 * Builds a Supabase profile update from the application's locally
 * persisted profile data.
 *
 * Trinity stores profile information across multiple local persistence
 * locations rather than as a single object. This helper gathers those
 * individual values and assembles them into the shape expected by the
 * `profiles` table.
 *
 * This function does not communicate with Supabase.
 *
 * @returns The locally assembled profile ready for upload.
 */
const buildProfile = async (): Promise<TablesUpdate<'profiles'>> => {
  const supabase = createClient()
  const profileId = await supabaseDb.getProfileId(supabase)

  // fasting
  const fastingPlanId = localStorage.getItem(FASTING_PLAN_ID_STORAGE_KEY)
  const fastingSession = localStorage.getItem(FASTING_SESSION_STORAGE_KEY)
  const preferredFastStartTime = localStorage.getItem(
    PREFERRED_FAST_START_TIME_STORAGE_KEY,
  )

  // weight
  const targetWeightKg = localStorage.getItem(TARGET_WEIGHT_KG_STORAGE_KEY)

  // gamification
  const xp = localStorage.getItem(XP_STORAGE_KEY)
  const streak = localStorage.getItem(STREAK_STORAGE_KEY)
  const anchors = localStorage.getItem(ANCHORS_STORAGE_KEY)

  return {
    id: profileId,
    fasting_plan_id: fastingPlanId,
    fasting_session: fastingSession ? JSON.parse(fastingSession) : null,
    preferred_fast_start_time: preferredFastStartTime
      ? JSON.parse(preferredFastStartTime)
      : null,
    target_weight_kg: targetWeightKg ? Number(targetWeightKg) : null,
    xp: xp ? Number(xp) : 0,
    streak: streak ? Number(streak) : 0,
    anchors: anchors ? Number(anchors) : 1,
  }
}

/**
 * Applies a downloaded profile to the application's local persistence.
 *
 * Trinity stores profile information across multiple local persistence
 * locations. This helper distributes the values from the Supabase
 * profile into their respective local storage locations.
 *
 * This function does not communicate with Supabase.
 *
 * @param profile The downloaded profile.
 */
const applyProfile = (profile: Tables<'profiles'>): void => {
  // fasting
  localStorage.setItem(
    FASTING_PLAN_ID_STORAGE_KEY,
    JSON.stringify(profile.fasting_plan_id),
  )
  localStorage.setItem(
    FASTING_SESSION_STORAGE_KEY,
    JSON.stringify(profile.fasting_session),
  )
  localStorage.setItem(
    PREFERRED_FAST_START_TIME_STORAGE_KEY,
    JSON.stringify(profile.preferred_fast_start_time),
  )

  // weight
  localStorage.setItem(
    TARGET_WEIGHT_KG_STORAGE_KEY,
    JSON.stringify(profile.target_weight_kg),
  )

  // gamification
  localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(profile.xp))
  localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(profile.streak))
  localStorage.setItem(ANCHORS_STORAGE_KEY, JSON.stringify(profile.anchors))
}

/**
 * Marks the locally persisted profile as requiring synchronization.
 *
 * Unlike fasts and weight entries, Trinity's profile is stored across
 * multiple LocalStorage keys rather than as a single object. This flag
 * indicates that one or more profile values have changed locally and
 * should be uploaded during the next synchronization cycle.
 */
export const markProfileNeedsSync = () => {
  localStorage.setItem(PROFILE_NEEDS_SYNC_STORAGE_KEY, 'true')
}

/**
 * Marks the locally persisted profile as synchronized.
 *
 * This should be called after a successful profile upload or whenever
 * the local profile has been updated to match the remote profile.
 */
export const clearProfileNeedsSync = () => {
  localStorage.setItem(PROFILE_NEEDS_SYNC_STORAGE_KEY, 'false')
}
