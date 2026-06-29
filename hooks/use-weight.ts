'use client'

import { WEIGHT_STATE_STORAGE_KEY } from '@/constants/storage-keys'
import { sortWeightEntries } from '@/lib/weight'
import type { WeightEntry, WeightState } from '@/types/weight'
import { isSameDay } from 'date-fns'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

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
  addWeight: (weightKg: number, recordedAt: Date) => void

  /**
   * Deletes a recorded weight entry.
   *
   * @param id The id of the weight entry to delete.
   */
  deleteWeight: (id: string) => void

  /**
   * Updates an existing weight entry.
   *
   * @param updatedWeightEntry The updated weight entry.
   */
  updateWeight: (updatedWeightEntry: WeightEntry) => void

  /**
   * Updates the user's target body weight.
   *
   * @param targetWeightKg The new target weight in kilograms.
   */
  updateTargetWeight: (targetWeightKg: number) => void

  /**
   * Whether the weight state has been restored from persisted storage.
   *
   * Useful for preventing hydration mismatches and displaying loading
   * placeholders while the initial state is being restored.
   */
  isHydrated: boolean
}

const DEFAULT_WEIGHT_STATE: WeightState = {
  entries: [],
  targetWeightKg: null,
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
  const [weightState, setWeightState] =
    useState<WeightState>(DEFAULT_WEIGHT_STATE)
  const [isHydrated, setIsHydrated] = useState<boolean>(false)

  const addWeight = (weightKg: number, recordedAt: Date) => {
    setWeightState((prev) => {
      const existingEntry = prev.entries.find((entry) =>
        isSameDay(new Date(entry.recordedAt), recordedAt),
      )

      return {
        ...prev,
        entries: sortWeightEntries([
          ...prev.entries.filter(
            (entry) => !isSameDay(new Date(entry.recordedAt), recordedAt),
          ),
          {
            id: existingEntry?.id ?? uuidv4(),
            recordedAt: recordedAt.toISOString(),
            weightKg: Number(weightKg.toFixed(1)),
          },
        ]),
      }
    })
  }

  const deleteWeight = (id: string) => {
    setWeightState((prev) => ({
      ...prev,
      entries: prev.entries.filter((w) => w.id !== id),
    }))
  }

  const updateWeight = (updatedWeightEntry: WeightEntry) => {
    setWeightState((prev) => ({
      ...prev,
      entries: sortWeightEntries(
        prev.entries.map((entry) =>
          entry.id === updatedWeightEntry.id ? updatedWeightEntry : entry,
        ),
      ),
    }))
  }

  const updateTargetWeight = (newTargetWeightKg: number) => {
    setWeightState((prev) => ({ ...prev, targetWeightKg: newTargetWeightKg }))
  }

  useEffect(() => {
    const hydrate = () => {
      try {
        const saved = localStorage.getItem(WEIGHT_STATE_STORAGE_KEY)
        if (!saved) return

        const state = JSON.parse(saved) as WeightState

        const isValidEntries =
          Array.isArray(state.entries) &&
          state.entries.every(
            (entry) =>
              typeof entry.id === 'string' &&
              typeof entry.recordedAt === 'string' &&
              typeof entry.weightKg === 'number',
          )

        const isValidTargetWeight =
          state.targetWeightKg === null ||
          typeof state.targetWeightKg === 'number'

        if (!isValidEntries || !isValidTargetWeight) {
          throw Error('Local storage was corrupted')
        }

        setWeightState({ ...state, entries: sortWeightEntries(state.entries) })
      } catch (error) {
        console.error('Hydrating weight state from local storage failed', error)
        localStorage.removeItem(WEIGHT_STATE_STORAGE_KEY)
        setWeightState(DEFAULT_WEIGHT_STATE)
      } finally {
        setIsHydrated(true)
      }
    }

    hydrate()
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    const sync = () => {
      localStorage.setItem(
        WEIGHT_STATE_STORAGE_KEY,
        JSON.stringify(weightState),
      )
    }

    sync()
  }, [isHydrated, weightState])

  return {
    addWeight,
    isHydrated,
    updateWeight,
    deleteWeight,
    updateTargetWeight,
    entries: weightState.entries,
    targetWeightKg: weightState.targetWeightKg,
  }
}
