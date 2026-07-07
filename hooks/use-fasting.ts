'use client'

import { fastingPlans } from '@/constants/fasting-plans'
import {
  FASTING_PLAN_ID_STORAGE_KEY,
  FASTING_SESSION_STORAGE_KEY,
  PREFERRED_FAST_START_TIME_STORAGE_KEY,
} from '@/constants/storage-keys'
import { sortFasts } from '@/lib/fasting'
import type {
  Fast,
  FastingPlanId,
  FastingSession,
  FastingStatus,
  PreferredFastStartTime,
} from '@/types/fasting'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  getFasts as getFastsFromIdxDB,
  addFast as addFastToIdxDB,
  updateFast as updateFastInIdxDB,
  deleteFast as deleteFastFromIdxDB,
} from '@/lib/indexed-db'
import { getStreakStatus } from '@/lib/gamification'

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
   * The user's preferred daily fasting start time.
   *
   * This preference is used as the default starting time when creating
   * or editing fasting sessions. It does not affect the timing of the
   * currently active fasting session.
   *
   * Returns `null` when no preferred start time has been configured.
   */
  preferredFastStartTime: PreferredFastStartTime | null

  /**
   * Updates the selected fasting plan.
   *
   * @param id The new fasting plan identifier.
   */
  updatePlanId: (id: FastingPlanId) => void

  /**
   * Starts a fasting session and records the current timestamp as the
   * session start time.
   *
   * @param startedAt The time when the fast has started.
   */
  startFasting: (startedAt?: Date) => Promise<void>

  /**
   * Ends the current fasting session and begins an eating session.
   *
   * If a fasting session is active, a completed fast is recorded and
   * persisted before the returned promise resolves.
   *
   * @param endedAt The time when the fast has ended.
   */
  endFasting: (endedAt?: Date) => Promise<void>

  /**
   * Optimistically adds a completed fast to the fasting history.
   *
   * If persistence fails, the optimistic update is rolled back and the
   * returned promise rejects.
   *
   * @param fast The completed fast to add.
   */
  addFast: (fast: Fast) => Promise<void>

  /**
   * Optimistically deletes a completed fast.
   *
   * If persistence fails, the optimistic update is rolled back and the
   * returned promise rejects.
   *
   * @param id The identifier of the fast to delete.
   */
  deleteFast: (id: string) => Promise<void>

  /**
   * Optimistically updates a completed fast.
   *
   * If persistence fails, the optimistic update is rolled back and the
   * returned promise rejects.
   *
   * @param updatedFast The updated fast.
   */
  updateFast: (updatedFast: Fast) => Promise<void>

  /**
   * Updates the user's preferred daily fasting start time.
   *
   * This preference is used as the default starting time when creating
   * or editing fasting sessions. It does not affect the timing of the
   * currently active fasting session.
   *
   * @param hour The preferred hour in 24-hour format.
   * @param minute The preferred minute.
   */
  updatePreferredFastStartTime: (hour: number, minute: number) => void

  /**
   * Clears the user's preferred daily fasting start time.
   *
   * After clearing the preference, new fasting sessions and dialogs
   * fall back to their default starting time.
   */
  clearPreferredFastStartTime: () => void

  /**
   *
   * @param updatedStartedAt
   * @returns
   */
  updateSessionStartedAt: (updatedStartedAt: Date) => void

  /**
   * Starts an anchored fasting session.
   *
   * An anchored fasting session allows the user to skip the current fast
   * while preserving their fasting streak. The current session remains
   * active but is marked as anchored, causing it to be recorded as an
   * anchored fast when it ends.
   */
  startAnchoredSession: () => void
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
  const [preferredFastStartTime, setPreferredFastStartTime] =
    useState<PreferredFastStartTime | null>(null)

  const updatePlanId = (planId: FastingPlanId) => setPlanId(planId)

  const updateSessionStartedAt = (updatedStartedAt: Date) => {
    setSession((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        startedAt: updatedStartedAt.toISOString(),
      }
    })
  }

  const updatePreferredFastStartTime = (hour: number, minute: number) => {
    setPreferredFastStartTime({ hour, minute })
  }

  const clearPreferredFastStartTime = () => setPreferredFastStartTime(null)

  const startSession = async (
    status: FastingStatus,
    startedAt: Date = new Date(),
    options?: {
      isAnchored?: boolean
    },
  ) => {
    if (!planId) {
      throw new Error('Cannot record a fast without a fasting plan.')
    }

    const sessionStartedAt = startedAt.toISOString()

    // Add a new fast when transitioning from eating to fasting.
    if (status === 'eating' && session?.status === 'fasting') {
      await addFast({
        id: uuidv4(),
        planId: planId,
        endedAt: sessionStartedAt,
        startedAt: session.startedAt,
        streakStatus: getStreakStatus({
          planId,
          endedAt: new Date(sessionStartedAt),
          startedAt: new Date(session.startedAt),
          isAnchored: session.isAnchored,
        }),
      })
    }

    setSession({
      status,
      startedAt: sessionStartedAt,
      isAnchored: options?.isAnchored ?? false,
    })
  }

  const startAnchoredSession = () => {
    setSession((prev) => {
      if (!prev) return prev

      return { ...prev, isAnchored: true }
    })
  }

  /**
   * Optimistically adds a completed fast.
   *
   * The fasting history is updated immediately for responsiveness. If the
   * database write fails, the previous state is restored and the returned
   * promise rejects.
   *
   * @param fast The completed fast to add.
   */
  const addFast = async (fast: Fast) => {
    let previousFasts: Fast[] = []

    setFasts((prev) => {
      previousFasts = prev
      return sortFasts([...prev, fast])
    })

    try {
      await addFastToIdxDB(fast)
    } catch (error) {
      setFasts(previousFasts)
      throw Error('Failed to save the fast', { cause: error })
    }
  }

  /**
   * Optimistically deletes a fast from the state.
   *
   * @param id The id of the deleted fast.
   */
  const deleteFast = async (id: string) => {
    let previousFasts: Fast[] = []

    setFasts((prev) => {
      previousFasts = prev
      return prev.filter((fast) => fast.id !== id)
    })

    try {
      await deleteFastFromIdxDB(id)
    } catch (error) {
      setFasts(previousFasts)
      throw Error('Failed to delete the fast', { cause: error })
    }
  }

  /**
   * Optimistically updates a fast.
   *
   * The fasting history is updated immediately for responsiveness. If the
   * database write fails, the previous state is restored and the returned
   * promise rejects.
   *
   * @param updatedFast The updated fast to update.
   */
  const updateFast = async (updatedFast: Fast) => {
    let previousFasts: Fast[] = []

    setFasts((prev) => {
      previousFasts = prev

      return sortFasts(
        prev.map((fast) => (fast.id === updatedFast.id ? updatedFast : fast)),
      )
    })

    try {
      await updateFastInIdxDB(updatedFast)
    } catch (error) {
      setFasts(previousFasts)
      throw Error('Failed to update the fast', { cause: error })
    }
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

  const hydratePreferredFastStartTime = () => {
    try {
      const saved = localStorage.getItem(PREFERRED_FAST_START_TIME_STORAGE_KEY)
      if (!saved) return

      const preferredFastStartTime = JSON.parse(saved) as PreferredFastStartTime

      const isObject =
        typeof preferredFastStartTime === 'object' &&
        preferredFastStartTime !== null

      const hasValidHour =
        Number.isInteger(preferredFastStartTime?.hour) &&
        preferredFastStartTime.hour >= 0 &&
        preferredFastStartTime.hour <= 23

      const hasValidMinute =
        Number.isInteger(preferredFastStartTime?.minute) &&
        preferredFastStartTime.minute >= 0 &&
        preferredFastStartTime.minute <= 59

      const isValidPreferredFastStartTime =
        preferredFastStartTime === null ||
        (isObject && hasValidHour && hasValidMinute)

      if (!isValidPreferredFastStartTime) {
        throw Error('Preferred fast start time in local storage corrupted')
      }

      setPreferredFastStartTime(preferredFastStartTime)
    } catch (error) {
      console.error(
        'Hydrating preferred fast start time from local storage failed',
        error,
      )
      localStorage.removeItem(PREFERRED_FAST_START_TIME_STORAGE_KEY)
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
        throw new Error('Fasting session in local storage corrupted')
      }

      setSession(
        session === null
          ? null
          : {
              ...session,
              isAnchored:
                typeof session.isAnchored === 'boolean'
                  ? session.isAnchored
                  : false,
            },
      )
    } catch (error) {
      console.error(
        'Hydrating fasting session from local storage failed',
        error,
      )
      localStorage.removeItem(FASTING_SESSION_STORAGE_KEY)
    }
  }

  const hydrateFasts = async () => {
    try {
      const fasts = await getFastsFromIdxDB()

      const migratedFasts = fasts.map((fast) => ({
        ...fast,
        streakStatus: fast.streakStatus ?? 'completed',
        planId: fast.planId ?? '23:1',
      }))

      setFasts(sortFasts(migratedFasts))
    } catch (error) {
      console.error('Hydrating fasts failed', error)
    }
  }

  useEffect(() => {
    const hydrate = async () => {
      try {
        hydratePlanId()
        hydrateSession()
        hydratePreferredFastStartTime()
        await hydrateFasts()
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

  useEffect(() => {
    if (isLoading) return

    const syncPreferredFastStartTime = () => {
      localStorage.setItem(
        PREFERRED_FAST_START_TIME_STORAGE_KEY,
        JSON.stringify(preferredFastStartTime),
      )
    }

    syncPreferredFastStartTime()
  }, [isLoading, preferredFastStartTime])

  return {
    fasts,
    planId,
    session,
    isLoading,
    addFast,
    deleteFast,
    updateFast,
    updatePlanId,
    startAnchoredSession,
    updateSessionStartedAt,
    preferredFastStartTime,
    updatePreferredFastStartTime,
    clearPreferredFastStartTime,
    endFasting: (endedAt) => startSession('eating', endedAt),
    startFasting: (startedAt) => startSession('fasting', startedAt),
  }
}
