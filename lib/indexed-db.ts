import { type IDBPDatabase, openDB, type DBSchema } from 'idb'
import type { Fast } from '@/types/fasting'
import { INDEXED_DB_NAME, INDEXED_DB_VERSION } from '@/constants/storage-keys'

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
}

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
      upgrade(db) {
        const store = db.createObjectStore('fasts', {
          keyPath: 'id',
        })

        store.createIndex('startedAt', 'startedAt')
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
  return db.getAll('fasts')
}

/**
 * Persists a new fast.
 *
 * @param fast The fast to add.
 */
export const addFast = async (fast: Fast) => {
  const db = await getDb()
  await db.add('fasts', fast)
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
  await db.put('fasts', fast)
}

/**
 * Deletes a fast.
 *
 * @param id The identifier of the fast to delete.
 */
export const deleteFast = async (id: string) => {
  const db = await getDb()
  await db.delete('fasts', id)
}
