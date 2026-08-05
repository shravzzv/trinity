/**
 * IndexedDB persistence utilities.
 *
 * Provides low-level CRUD operations for Trinity's local IndexedDB database.
 *
 * This module intentionally contains no synchronization logic.
 * Synchronization is coordinated by `lib/sync.ts`, which uses this
 * module together with `lib/supabase-db.ts`.
 */

import { type IDBPDatabase, openDB, type DBSchema } from 'idb'
import type { Fast } from '@/types/fasting'
import { INDEXED_DB_NAME, INDEXED_DB_VERSION } from '@/constants/storage-keys'
import type { WeightEntry } from '@/types/weight'
import type { PendingDelete, PendingDeleteEntity } from '@/types/sync'

/**
 * Application database schema.
 *
 * Defines the object stores and indexes used by Trinity's IndexedDB
 * database. This schema provides end-to-end type safety for all
 * database operations performed through the `idb` library.
 */
interface TrinityDB extends DBSchema {
  fasts: {
    key: string
    value: Fast
    indexes: {
      startedAt: string
    }
  }

  weightEntries: {
    key: string
    value: WeightEntry
    indexes: {
      recordedAt: string
    }
  }

  pendingDeletes: {
    key: string
    value: PendingDelete
    indexes: {
      entity: PendingDeleteEntity
      deletedAt: string
    }
  }
}

const FASTS_STORE_NAME = 'fasts'
const WEIGHT_ENTRIES_STORE_NAME = 'weightEntries'
const PENDING_DELETES_STORE_NAME = 'pendingDeletes'

/**
 * Lazily initialized database connection.
 */
let dbPromise: Promise<IDBPDatabase<TrinityDB>> | null = null

/**
 * Returns the application's IndexedDB connection.
 *
 * The connection is created lazily on first use and reused for all
 * subsequent database operations.
 *
 * @throws {Error} If called in a non-browser environment where
 * IndexedDB is unavailable.
 *
 * @returns A promise that resolves to the application's database.
 */
const getDb = () => {
  if (typeof window === 'undefined') {
    throw Error('IndexedDB is only available in the browser.')
  }

  if (!dbPromise) {
    dbPromise = openDB<TrinityDB>(INDEXED_DB_NAME, INDEXED_DB_VERSION, {
      upgrade(db, oldVersion) {
        switch (oldVersion) {
          case 0: {
            const fastsStore = db.createObjectStore(FASTS_STORE_NAME, {
              keyPath: 'id',
            })

            fastsStore.createIndex('startedAt', 'startedAt')

            const weightEntriesStore = db.createObjectStore(
              WEIGHT_ENTRIES_STORE_NAME,
              {
                keyPath: 'id',
              },
            )

            weightEntriesStore.createIndex('recordedAt', 'recordedAt')
          }

          case 1: {
            const pendingDeletesStore = db.createObjectStore(
              PENDING_DELETES_STORE_NAME,
              {
                keyPath: 'id',
              },
            )

            pendingDeletesStore.createIndex('entity', 'entity')
            pendingDeletesStore.createIndex('deletedAt', 'deletedAt')
          }
        }
      },
    })
  }

  return dbPromise
}

/**
 * Returns all recorded fasts.
 *
 * @returns A promise that resolves to all stored fasts.
 */
export const getFasts = async () => {
  const db = await getDb()
  return db.getAll(FASTS_STORE_NAME)
}

/**
 * Persists a new fast.
 *
 * @param fast The fast to add.
 */
export const addFast = async (fast: Fast) => {
  const db = await getDb()
  await db.add(FASTS_STORE_NAME, fast)
}

/**
 * Updates an existing fast.
 *
 * The supplied fast must have the same id as an existing record.
 *
 * @param fast The updated fast.
 */
export const updateFast = async (fast: Fast) => {
  const db = await getDb()
  await db.put(FASTS_STORE_NAME, fast)
}

/**
 * Deletes a fast.
 *
 * @param id The identifier of the fast to delete.
 */
export const deleteFast = async (id: string) => {
  const db = await getDb()
  await db.delete(FASTS_STORE_NAME, id)
}

/**
 * Returns all recorded weight entries.
 *
 * @returns A promise that resolves to all stored weight entries.
 */
export const getWeightEntries = async () => {
  const db = await getDb()
  return db.getAll(WEIGHT_ENTRIES_STORE_NAME)
}

/**
 * Persists a new weight entry.
 *
 * @param entry The weight entry to add.
 */
export const addWeightEntry = async (entry: WeightEntry) => {
  const db = await getDb()
  await db.add(WEIGHT_ENTRIES_STORE_NAME, entry)
}

/**
 * Updates an existing weight entry.
 *
 * @param entry The updated weight entry.
 */
export const updateWeightEntry = async (entry: WeightEntry) => {
  const db = await getDb()
  await db.put(WEIGHT_ENTRIES_STORE_NAME, entry)
}

/**
 * Deletes a weight entry.
 *
 * @param id The identifier of the weight entry to delete.
 */
export const deleteWeightEntry = async (id: string) => {
  const db = await getDb()
  await db.delete(WEIGHT_ENTRIES_STORE_NAME, id)
}

/**
 * Returns all pending deletes.
 *
 * @returns A promise that resolves to all pending deletes.
 */
export const getPendingDeletes = async () => {
  const db = await getDb()
  return db.getAll(PENDING_DELETES_STORE_NAME)
}

/**
 * Persists a new pending delete.
 *
 * @param pendingDelete The pending delete to add.
 */
export const addPendingDelete = async (pendingDelete: PendingDelete) => {
  const db = await getDb()
  await db.add(PENDING_DELETES_STORE_NAME, pendingDelete)
}

/**
 * Removes a pending delete.
 *
 * @param id The identifier of the pending delete.
 */
export const removePendingDelete = async (id: string) => {
  const db = await getDb()
  await db.delete(PENDING_DELETES_STORE_NAME, id)
}
