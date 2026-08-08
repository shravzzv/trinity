'use client'

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
import * as indexedDb from '@/lib/indexed-db'
import { getStreakStatus } from '@/lib/gamification'
import { requestSync, subscribeToSync } from '@/lib/sync'
import { getProfile, updateProfile } from '@/lib/profile'

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

  const updatePlanId = (planId: FastingPlanId) => {
    setPlanId(planId)

    updateProfile((profile) => ({
      ...profile,
      fastingPlanId: planId,
      needsSync: true,
    }))

    void requestSync()
  }

  const updateSessionStartedAt = (updatedStartedAt: Date) => {
    if (!session) return

    const updatedSession: FastingSession = {
      ...session,
      startedAt: updatedStartedAt.toISOString(),
    }

    setSession(updatedSession)

    updateProfile((profile) => ({
      ...profile,
      fastingSession: updatedSession,
      needsSync: true,
    }))

    void requestSync()
  }

  const updatePreferredFastStartTime = (hour: number, minute: number) => {
    const preferredFastStartTime = { hour, minute }

    setPreferredFastStartTime(preferredFastStartTime)

    updateProfile((profile) => ({
      ...profile,
      preferredFastStartTime,
      needsSync: true,
    }))

    void requestSync()
  }

  const clearPreferredFastStartTime = () => {
    setPreferredFastStartTime(null)

    updateProfile((profile) => ({
      ...profile,
      preferredFastStartTime: null,
      needsSync: true,
    }))

    void requestSync()
  }

  const transitionToSession = async (
    status: FastingStatus,
    newSessionStartedAt: Date = new Date(),
    options?: {
      isAnchored?: boolean
    },
  ) => {
    if (!planId) {
      throw Error('Cannot record a fast without a fasting plan.')
    }

    const newSessionStartedAtISO = newSessionStartedAt.toISOString()

    const isLeavingFastingSession =
      session?.status === 'fasting' &&
      (status === 'eating' || session.isAnchored)

    const nextSession: FastingSession = {
      status,
      startedAt: newSessionStartedAtISO,
      isAnchored: options?.isAnchored ?? false,
    }

    setSession(nextSession)

    updateProfile((profile) => ({
      ...profile,
      fastingSession: nextSession,
      needsSync: true,
    }))

    if (isLeavingFastingSession) {
      await addFast({
        planId,
        id: uuidv4(),
        needsSync: true,
        startedAt: session.startedAt,
        endedAt: newSessionStartedAtISO,
        streakStatus: getStreakStatus({
          planId,
          endedAt: newSessionStartedAt,
          isAnchored: session.isAnchored,
          startedAt: new Date(session.startedAt),
        }),
      })

      return
    }

    void requestSync()
  }

  const startAnchoredSession = () => {
    if (!session) return
    const nextSession = { ...session, isAnchored: true }

    setSession(nextSession)

    updateProfile((profile) => ({
      ...profile,
      fastingSession: nextSession,
      needsSync: true,
    }))

    void requestSync()
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
      await indexedDb.addFast(fast)
      void requestSync()
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
      await indexedDb.deleteFast(id)

      await indexedDb.addPendingDelete({
        id: uuidv4(),
        entityId: id,
        deletedAt: new Date().toISOString(),
        entity: 'fast',
      })

      void requestSync()
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
      await indexedDb.updateFast(updatedFast)
      void requestSync()
    } catch (error) {
      setFasts(previousFasts)
      throw Error('Failed to update the fast', { cause: error })
    }
  }

  const hydrateProfile = () => {
    const profile = getProfile()

    setPlanId(profile.fastingPlanId)
    setSession(profile.fastingSession)
    setPreferredFastStartTime(profile.preferredFastStartTime)
  }

  const hydrateFasts = async () => {
    try {
      const fasts = await indexedDb.getFasts()

      const migratedFasts = fasts.map((fast) => ({
        ...fast,
        planId: fast.planId ?? '23:1',
        needsSync: fast.needsSync ?? true,
        // using completed as the default streak status
        streakStatus: fast.streakStatus ?? 'completed',
      }))

      setFasts(sortFasts(migratedFasts))
    } catch (error) {
      console.error('Hydrating fasts failed', error)
    }
  }

  useEffect(() => {
    const hydrate = async () => {
      try {
        // Restore local state immediately so the UI can initialize
        // without waiting for cloud synchronization.
        hydrateProfile()

        await hydrateFasts()

        // Synchronization may replace the locally persisted profile with
        // a newer remote profile, so hydrate again after synchronization
        // to reflect any downloaded changes in React state.
        await requestSync()
        hydrateProfile()
      } finally {
        setIsLoading(false)
      }
    }

    void hydrate()
  }, [])

  useEffect(() => {
    const listener = () => {
      hydrateProfile()
      void hydrateFasts()
    }

    const unsubscribe = subscribeToSync(listener)

    return unsubscribe
  }, [])

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
    endFasting: (endedAt) => transitionToSession('eating', endedAt),
    startFasting: (startedAt) => transitionToSession('fasting', startedAt),
  }
}
