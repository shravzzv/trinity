/**
 * Synchronization engine.
 *
 * Coordinates synchronization between Trinity's browser storage and Supabase.
 * This is the only module that communicates with both persistence layers:
 *   LocalStorage/IndexedDB  ⇄  sync.ts  ⇄  Supabase
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

import * as indexedDb from '@/lib/indexed-db'
import * as supabaseDb from '@/lib/supabase-db'
import { createClient } from '@/supabase/client'
import type { Fast } from '@/types/fasting'
import type { WeightEntry } from '@/types/weight'
import { getProfile, saveProfile } from './profile'

/**
 * Represents the currently running synchronization, if any.
 *
 * When a synchronization is in progress, subsequent calls to
 * {@link requestSync} return this same promise rather than starting
 * another synchronization.
 */
let syncPromise: Promise<void> | null = null

/**
 * Requests a synchronization.
 *
 * This is the public entry point used throughout the application.
 *
 * If a synchronization is already in progress, no additional
 * synchronization is started. Instead, the promise for the existing
 * synchronization is returned so callers can wait for it to finish.
 *
 * This ensures that synchronization requests are deduplicated while
 * still allowing callers to reliably await the active synchronization.
 *
 * @returns A promise that resolves when the requested synchronization
 * finishes, or when an already-running synchronization finishes.
 */
export const requestSync = (): Promise<void> => {
  if (syncPromise) return syncPromise

  syncPromise = sync().finally(() => {
    syncPromise = null
  })

  return syncPromise
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
  const profile = getProfile()
  if (!profile.needsSync) return

  const syncedAt = new Date().toISOString()
  profile.lastSyncedAt = syncedAt

  await supabaseDb.updateProfile(profile)

  profile.needsSync = false
  saveProfile(profile)
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
  const localProfile = getProfile()

  if (localProfile.needsSync) return

  if (
    remoteProfile.lastSyncedAt &&
    (!localProfile.lastSyncedAt ||
      remoteProfile.lastSyncedAt > localProfile.lastSyncedAt)
  ) {
    saveProfile(remoteProfile)
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
