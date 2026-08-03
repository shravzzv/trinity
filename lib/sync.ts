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

import * as indexedDb from '@/lib/indexed-db'
import * as supabaseDb from '@/lib/supabase-db'
import { createClient } from '@/supabase/client'
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
 * Uploads the local profile if it requires synchronization.
 */
const uploadProfile = async (): Promise<void> => {}

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
const downloadProfile = async (): Promise<void> => {
  // TODO:
  // - Fetch the user's profile from Supabase.
  // - Return if no profile exists.
  // - Compare with the local profile.
  // - Update LocalStorage if the remote version is newer.
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
