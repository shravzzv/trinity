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
  await Promise.all([uploadProfile(), uploadFasts(), uploadWeightEntries()])
}

/**
 * Downloads remote changes from Supabase.
 */
const downloadRemoteChanges = async (): Promise<void> => {
  await Promise.all([
    downloadProfile(),
    downloadFasts(),
    downloadWeightEntries(),
  ])
}

/**
 * Uploads the local profile to the cloud.
 */
const uploadProfile = async () => {
  const profile = await buildProfile()

  const syncedAt = new Date().toISOString()
  profile.last_synced_at = syncedAt

  await supabaseDb.updateProfile(profile)

  localStorage.setItem(PROFILE_LAST_SYNCED_AT_STORAGE_KEY, syncedAt)
}

/**
 * Uploads all pending fasts.
 */
const uploadFasts = async (): Promise<void> => {
  const fasts: Fast[] = await indexedDb.getFasts()

  const fastsNeedingSync = fasts.filter((fast) => fast.needsSync === true)
  if (fastsNeedingSync.length === 0) return

  await supabaseDb.addFasts(fastsNeedingSync)

  // Every uploaded fast needs its needSync set to false.
  fastsNeedingSync.forEach((fast) => (fast.needsSync = false))

  // Persist the updated fasts back to IndexedDB.
  await Promise.all(fastsNeedingSync.map((fast) => indexedDb.updateFast(fast)))
}

/**
 * Uploads all pending weight entries.
 */
const uploadWeightEntries = async (): Promise<void> => {
  const weightEntries: WeightEntry[] = await indexedDb.getWeightEntries()

  const weightEntriesNeedingSync = weightEntries.filter(
    (entry) => entry.needsSync === true,
  )
  if (weightEntriesNeedingSync.length === 0) return

  await supabaseDb.addWeightEntries(weightEntriesNeedingSync)

  // Every uploaded weight entry needs its needSync set to false.
  weightEntriesNeedingSync.forEach((entry) => (entry.needsSync = false))

  // Persist the updated entry back to IndexedDB.
  await Promise.all(
    weightEntriesNeedingSync.map((entry) => indexedDb.updateWeightEntry(entry)),
  )
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

  await Promise.all(
    entriesNeedingDownload.map((entry) => indexedDb.addWeightEntry(entry)),
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
