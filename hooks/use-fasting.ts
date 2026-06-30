'use client'

import { fastingPlans } from '@/constants/fasting-plans'
import { FASTING_STATE_STORAGE_KEY } from '@/constants/storage-keys'
import type {
  Fast,
  FastingPlanId,
  FastingSession,
  FastingState,
  FastingStatus,
} from '@/types/fasting'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

/**
 * The public API exposed by {@link useFasting}.
 */
export interface UseFastingResult {
  /**
   * The currently selected fasting plan.
   *
   * Is `null` by default. This is required domain data for the app.
   */
  planId: FastingPlanId | null

  /**
   * The user's active fasting session.
   *
   * Returns `null` when no fasting or eating session is active.
   */
  session: FastingSession | null

  /**
   * An array of all the fasts the user has completed.
   */
  fasts: Fast[]

  /**
   * Whether the fasting state has been restored from persisted storage.
   *
   * Useful for preventing hydration mismatches and displaying loading
   * placeholders while the initial state is being restored.
   */
  isHydrated: boolean

  /**
   * Updates the selected fasting plan.
   *
   * @param id The new fasting plan identifier.
   */
  updatePlanId: (id: FastingPlanId) => void

  /**
   * Starts a fasting session and records the current timestamp as the
   * session start time.
   */
  startFasting: () => void

  /**
   * Starts an eating session and records the current timestamp as the
   * session start time.
   */
  endFasting: () => void

  /**
   * Adds a new fast to the fasting history while ensuring the ascending
   * order of the fasts.
   *
   * @param fast The new fast to add.
   */
  addFast: (fast: Fast) => void

  /**
   * Deletes a fast from the fasting history.
   *
   * @param id The id of the fast to delete
   */
  deleteFast: (id: string) => void

  /**
   * Updates a fast in the fasting history.
   *
   * @param updatedFast The updated fast.
   */
  updateFast: (updatedFast: Fast) => void
}

const DEFAULT_FASTING_STATE: FastingState = {
  planId: null,
  session: null,
  fasts: [],
}

/**
 * Manages the fasting domain state for the application.
 *
 * Responsibilities:
 *
 * - Tracks the selected fasting plan.
 * - Tracks the user's current fasting or eating session.
 * - Restores previously saved state from persistent storage.
 * - Persists state changes automatically.
 * - Exposes actions for starting fasting and eating sessions.
 * - Tracks the user's completed fasts.
 * - Allows fasts to be added and removed.
 *
 * The hook initializes with a default fasting plan and no active session.
 * Once mounted, it attempts to hydrate state from persisted storage and
 * falls back to the default state if the stored data is missing or invalid.
 *
 * @returns The current fasting state and actions for updating it.
 */
export const useFasting = (): UseFastingResult => {
  const [fastingState, setFastingState] = useState<FastingState>(
    DEFAULT_FASTING_STATE,
  )
  const [isHydrated, setIsHydrated] = useState<boolean>(false)

  const updatePlanId = (planId: FastingPlanId) => {
    setFastingState((p) => ({ ...p, planId }))
  }

  const startSession = (status: FastingStatus) => {
    setFastingState((previous) => {
      const now = new Date().toISOString()
      const fasts =
        previous.session?.status === 'fasting' && status === 'eating'
          ? [
              ...previous.fasts,
              {
                id: uuidv4(),
                startedAt: previous.session.startedAt,
                endedAt: now,
              },
            ]
          : previous.fasts

      return {
        ...previous,
        fasts,
        session: { status, startedAt: now },
      }
    })
  }

  const addFast = (fast: Fast) => {
    setFastingState((previous) => ({
      ...previous,
      fasts: [...previous.fasts, fast].sort(
        (a, b) =>
          new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
      ),
    }))
  }

  const deleteFast = (id: string) => {
    setFastingState((previous) => ({
      ...previous,
      fasts: previous.fasts.filter((fast) => fast.id !== id),
    }))
  }

  const updateFast = (updatedFast: Fast) => {
    setFastingState((previous) => ({
      ...previous,
      fasts: previous.fasts
        .map((fast) => (fast.id === updatedFast.id ? updatedFast : fast))
        .sort(
          (a, b) =>
            new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
        ),
    }))
  }

  useEffect(() => {
    const hydrate = () => {
      try {
        const saved = localStorage.getItem(FASTING_STATE_STORAGE_KEY)
        if (!saved) return

        const state = JSON.parse(saved) as FastingState

        const isValidSession =
          state.session === null ||
          (typeof state.session.startedAt === 'string' &&
            (state.session.status === 'fasting' ||
              state.session.status === 'eating'))

        const isValidPlan =
          state.planId === null ||
          fastingPlans.some((plan) => plan.id === state.planId)

        if (!isValidSession || !isValidPlan) {
          throw Error('Local storage was corrupted')
        }

        setFastingState(state)
      } catch (error) {
        console.error(
          'Hydrating fasting state from local storage failed',
          error,
        )
        localStorage.removeItem(FASTING_STATE_STORAGE_KEY)
        setFastingState(DEFAULT_FASTING_STATE)
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
        FASTING_STATE_STORAGE_KEY,
        JSON.stringify(fastingState),
      )
    }

    sync()
  }, [fastingState, isHydrated])

  return {
    addFast,
    isHydrated,
    deleteFast,
    updateFast,
    updatePlanId,
    fasts: fastingState.fasts,
    planId: fastingState.planId,
    session: fastingState.session,
    endFasting: () => startSession('eating'),
    startFasting: () => startSession('fasting'),
  }
}
