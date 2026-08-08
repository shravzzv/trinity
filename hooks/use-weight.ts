'use client'

import { sortWeightEntries } from '@/lib/weight'
import type { WeightEntry } from '@/types/weight'
import { isSameDay } from 'date-fns'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import * as indexedDb from '@/lib/indexed-db'
import { requestSync } from '@/lib/sync'
import { getProfile, updateProfile } from '@/lib/profile'

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
      needsSync: true,
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
      if (existingEntry) await indexedDb.updateWeightEntry(entry)
      else await indexedDb.addWeightEntry(entry)
      void requestSync()
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
      await indexedDb.deleteWeightEntry(id)

      await indexedDb.addPendingDelete({
        id: uuidv4(),
        entityId: id,
        deletedAt: new Date().toISOString(),
        entity: 'weightEntry',
      })

      void requestSync()
    } catch (error) {
      setWeightEntries(previousEntries)
      throw Error('Failed to delete the weight', { cause: error })
    }
  }

  const updateWeightEntry = async (updatedWeightEntry: WeightEntry) => {
    const entry = {
      ...updatedWeightEntry,
      needsSync: true,
    }

    let previousEntries: WeightEntry[] = []

    setWeightEntries((prev) => {
      previousEntries = prev

      return sortWeightEntries(
        prev.map((weightEntry) =>
          weightEntry.id === entry.id ? entry : weightEntry,
        ),
      )
    })

    try {
      await indexedDb.updateWeightEntry(entry)
      void requestSync()
    } catch (error) {
      setWeightEntries(previousEntries)
      throw Error('Failed to update the weight', { cause: error })
    }
  }

  const updateTargetWeight = (newTargetWeightKg: number) => {
    setTargetWeightKg(newTargetWeightKg)

    updateProfile((profile) => ({
      ...profile,
      targetWeightKg: newTargetWeightKg,
      needsSync: true,
    }))

    void requestSync()
  }

  const clearTargetWeight = () => {
    setTargetWeightKg(null)

    updateProfile((profile) => ({
      ...profile,
      targetWeightKg: null,
      needsSync: true,
    }))

    void requestSync()
  }

  const hydrateProfile = () => {
    const profile = getProfile()

    setTargetWeightKg(profile.targetWeightKg)
  }

  const hydrateWeightEntries = async () => {
    try {
      const entries = await indexedDb.getWeightEntries()

      const migratedEntries = entries.map((entry) => ({
        ...entry,
        needsSync: entry.needsSync ?? true,
      }))

      setWeightEntries(sortWeightEntries(migratedEntries))
    } catch (error) {
      console.error('Hydrating weight entries failed', error)
    }
  }

  useEffect(() => {
    const hydrate = async () => {
      try {
        hydrateProfile()
        await hydrateWeightEntries()
      } finally {
        setIsLoading(false)
        void requestSync()
      }
    }

    hydrate()
  }, [])

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
