'use client'

import { fastingPlans } from '@/constants/fasting-plans'
import {
  FASTING_PLAN_ID_STORAGE_KEY,
  FASTING_SESSION_STORAGE_KEY,
} from '@/constants/storage-keys'
import { sortFasts } from '@/lib/fasting'
import type {
  Fast,
  FastingPlanId,
  FastingSession,
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
   * Whether the fasting state is currently being restored or synchronized.
   */
  isLoading: boolean

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
  const [fasts, setFasts] = useState<Fast[]>([])
  const [planId, setPlanId] = useState<FastingPlanId | null>(null)
  const [session, setSession] = useState<FastingSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const updatePlanId = (planId: FastingPlanId) => setPlanId(planId)

  const startSession = (status: FastingStatus) => {
    const now = new Date().toISOString()

    if (session?.status === 'fasting' && status === 'eating') {
      addFast({ id: uuidv4(), startedAt: session.startedAt, endedAt: now })
    }

    setSession({ status, startedAt: now })
  }

  const addFast = (fast: Fast) => {
    setFasts((prev) => sortFasts([...prev, fast]))
  }

  const deleteFast = (id: string) => {
    setFasts((prev) => prev.filter((fast) => fast.id !== id))
  }

  const updateFast = (updatedFast: Fast) => {
    setFasts((prev) =>
      sortFasts(
        prev.map((fast) => (fast.id === updatedFast.id ? updatedFast : fast)),
      ),
    )
  }

  const hydratePlanId = () => {
    try {
      const saved = localStorage.getItem(FASTING_PLAN_ID_STORAGE_KEY)
      if (!saved) return

      const planId = JSON.parse(saved) as FastingPlanId | null

      const isValidPlanId =
        planId === null || fastingPlans.some((plan) => plan.id === planId)

      if (!isValidPlanId) {
        throw Error('Fasting plan id in local storage corrupted')
      }

      setPlanId(planId)
    } catch (error) {
      console.error(
        'Hydrating fasting plan id from local storage failed',
        error,
      )
      localStorage.removeItem(FASTING_PLAN_ID_STORAGE_KEY)
    }
  }

  const hydrateSession = () => {
    try {
      const saved = localStorage.getItem(FASTING_SESSION_STORAGE_KEY)
      if (!saved) return

      const session = JSON.parse(saved) as FastingSession

      const isValidSession =
        session === null ||
        (typeof session.startedAt === 'string' &&
          (session.status === 'fasting' || session.status === 'eating'))

      if (!isValidSession) {
        throw Error('Fasting session in local storage corrupted')
      }

      setSession(session)
    } catch (error) {
      console.error(
        'Hydrating fasting session from local storage failed',
        error,
      )
      localStorage.removeItem(FASTING_SESSION_STORAGE_KEY)
    }
  }

  useEffect(() => {
    const hydrate = () => {
      try {
        hydratePlanId()
        hydrateSession()
      } finally {
        setIsLoading(false)
      }
    }

    hydrate()
  }, [])

  useEffect(() => {
    if (isLoading) return

    const syncPlanId = () => {
      localStorage.setItem(FASTING_PLAN_ID_STORAGE_KEY, JSON.stringify(planId))
    }

    syncPlanId()
  }, [isLoading, planId])

  useEffect(() => {
    if (isLoading) return

    const syncSession = () => {
      localStorage.setItem(FASTING_SESSION_STORAGE_KEY, JSON.stringify(session))
    }

    syncSession()
  }, [isLoading, session])

  return {
    fasts,
    planId,
    session,
    isLoading,
    addFast,
    deleteFast,
    updateFast,
    updatePlanId,
    endFasting: () => startSession('eating'),
    startFasting: () => startSession('fasting'),
  }
}
