'use client'

import { TARGET_WEIGHT_KG_STORAGE_KEY } from '@/constants/storage-keys'
import { sortWeightEntries } from '@/lib/weight'
import type { WeightEntry } from '@/types/weight'
import { isSameDay } from 'date-fns'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  getWeightEntries as getWeightEntriesFromIdxDB,
  addWeightEntry as addWeightEntryToIdxDB,
  updateWeightEntry as updateWeightEntryInIdxDB,
  deleteWeightEntry as deleteWeightEntryFromIdxDB,
} from '@/lib/indexed-db'

/**
 * The public API exposed by {@link useWeight}.
 */
interface UseWeightResult {
  /**
   * The user's target body weight in kilograms.
   *
   * Returns `null` when no target weight has been set.
   */
  targetWeightKg: number | null

  /**
   * All recorded weight entries in ascending chronological order.
   */
  entries: WeightEntry[]

  /**
   * Records a new weight entry.
   *
   * @param weightKg The recorded body weight in kilograms.
   * @param recordedAt When the weight was recorded.
   */
  addWeightEntry: (weightKg: number, recordedAt: Date) => Promise<void>

  /**
   * Deletes a recorded weight entry.
   *
   * @param id The id of the weight entry to delete.
   */
  deleteWeightEntry: (id: string) => Promise<void>

  /**
   * Updates an existing weight entry.
   *
   * @param updatedWeightEntry The updated weight entry.
   */
  updateWeightEntry: (updatedWeightEntry: WeightEntry) => Promise<void>

  /**
   * Updates the user's target body weight.
   *
   * @param targetWeightKg The new target weight in kilograms.
   */
  updateTargetWeight: (targetWeightKg: number) => void

  /**
   * Whether the weight state is currently being restored or synchronized.
   */
  isLoading: boolean

  /**
   * Resets the target weight to null.
   */
  clearTargetWeight: () => void
}

/**
 * Manages the user's weight tracking state.
 *
 * Responsibilities:
 *
 * - Tracks the user's recorded weight history.
 * - Tracks the user's target body weight.
 * - Restores previously saved state from persistent storage.
 * - Persists state changes automatically.
 * - Exposes actions for adding, updating, and deleting weight entries.
 * - Ensures weight entries remain in ascending chronological order.
 *
 * The hook initializes with no recorded weights and no target weight.
 *
 * @returns The current weight state and actions for updating it.
 */
export const useWeight = (): UseWeightResult => {
  const [isLoading, setIsLoading] = useState(true)
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([])
  const [targetWeightKg, setTargetWeightKg] = useState<number | null>(null)

  const addWeightEntry = async (weightKg: number, recordedAt: Date) => {
    const previousEntries = weightEntries

    const existingEntry = previousEntries.find((entry) =>
      isSameDay(new Date(entry.recordedAt), recordedAt),
    )

    const entry: WeightEntry = {
      id: existingEntry?.id ?? uuidv4(),
      recordedAt: recordedAt.toISOString(),
      weightKg: Number(weightKg.toFixed(1)),
    }

    setWeightEntries(
      sortWeightEntries([
        ...previousEntries.filter(
          (e) => !isSameDay(new Date(e.recordedAt), recordedAt),
        ),
        entry,
      ]),
    )

    try {
      if (existingEntry) await updateWeightEntryInIdxDB(entry)
      else await addWeightEntryToIdxDB(entry)
    } catch (error) {
      setWeightEntries(previousEntries)
      throw Error('Failed to save the weight', { cause: error })
    }
  }

  const deleteWeightEntry = async (id: string) => {
    let previousEntries: WeightEntry[] = []

    setWeightEntries((prev) => {
      previousEntries = prev
      return prev.filter((entry) => entry.id !== id)
    })

    try {
      await deleteWeightEntryFromIdxDB(id)
    } catch (error) {
      setWeightEntries(previousEntries)
      throw Error('Failed to delete the weight', { cause: error })
    }
  }

  const updateWeightEntry = async (updatedWeightEntry: WeightEntry) => {
    let previousEntries: WeightEntry[] = []

    setWeightEntries((prev) => {
      previousEntries = prev

      return sortWeightEntries(
        prev.map((entry) =>
          entry.id === updatedWeightEntry.id ? updatedWeightEntry : entry,
        ),
      )
    })

    try {
      await updateWeightEntryInIdxDB(updatedWeightEntry)
    } catch (error) {
      setWeightEntries(previousEntries)
      throw Error('Failed to update the weight', { cause: error })
    }
  }

  const updateTargetWeight = (newTargetWeightKg: number) => {
    setTargetWeightKg(newTargetWeightKg)
  }

  const clearTargetWeight = () => setTargetWeightKg(null)

  const hydrateTargetWeightKg = () => {
    try {
      const saved = localStorage.getItem(TARGET_WEIGHT_KG_STORAGE_KEY)
      if (!saved) return

      const targetWeightKg = JSON.parse(saved) as number | null

      const isValidTargetWeightKg =
        targetWeightKg === null || typeof targetWeightKg === 'number'

      if (!isValidTargetWeightKg) {
        throw Error('Target weight in local storage corrupted')
      }

      setTargetWeightKg(targetWeightKg)
    } catch (error) {
      console.error('Hydrating target weight from local storage failed', error)
      localStorage.removeItem(TARGET_WEIGHT_KG_STORAGE_KEY)
    }
  }

  const hydrateWeightEntries = async () => {
    try {
      const entries = await getWeightEntriesFromIdxDB()
      setWeightEntries(sortWeightEntries(entries))
    } catch (error) {
      console.error('Hydrating weight entries failed', error)
    }
  }

  useEffect(() => {
    const hydrate = async () => {
      try {
        hydrateTargetWeightKg()
        await hydrateWeightEntries()
      } finally {
        setIsLoading(false)
      }
    }

    hydrate()
  }, [])

  useEffect(() => {
    if (isLoading) return

    const syncTargetWeightKg = () => {
      localStorage.setItem(
        TARGET_WEIGHT_KG_STORAGE_KEY,
        JSON.stringify(targetWeightKg),
      )
    }

    syncTargetWeightKg()
  }, [isLoading, targetWeightKg])

  return {
    isLoading,
    targetWeightKg,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    clearTargetWeight,
    updateTargetWeight,
    entries: weightEntries,
  }
}
