'use client'

import { INITIAL_ANCHORS } from '@/constants/gamification'
import {
  ANCHORS_STORAGE_KEY,
  STREAK_STORAGE_KEY,
  XP_STORAGE_KEY,
} from '@/constants/storage-keys'
import { getLevelForXp, shouldCelebrateStreak } from '@/lib/gamification'
import type { Achievement } from '@/types/gamification'
import { useEffect, useState } from 'react'

/**
 * Result returned by {@link useGamification}.
 *
 * Exposes the user's current gamification progress and methods for
 * updating it.
 */
interface UseGamificationResult {
  /**
   * The user's total experience points.
   */
  xp: number

  /**
   * The user's current consecutive streak.
   */
  streak: number

  /**
   * The number of unused Anchors available.
   */
  anchors: number

  /**
   * Whether the gamification state is currently being restored or synchronized.
   */
  isLoading: boolean

  /**
   * Awards experience points to the user.
   *
   * @param amount The amount of XP to award.
   */
  awardXp: (amount: number) => void

  /**
   * Awards an Anchor to the user.
   */
  awardAnchor: () => void

  /**
   * Spends one available Anchor.
   *
   * If no Anchors are available, this method has no effect.
   */
  spendAnchor: () => void

  /**
   * Increments the user's current streak by one.
   */
  incrementStreak: () => void

  /**
   * Resets the user's current streak to zero.
   */
  resetStreak: () => void

  /**
   * The next achievement waiting to be presented to the user.
   *
   * Returns `null` when there are no pending achievements.
   */
  currentAchievement: Achievement | null

  /**
   * Dismisses the current achievement.
   *
   * If additional achievements are waiting, the next one becomes current.
   */
  dismissAchievement: () => void
}

/**
 * Manages Trinity's gamification state.
 *
 * This hook owns the user's gamification progress, including their
 * streak, available Anchors, XP, and level. It exposes the current
 * values along with domain-specific actions for updating them as the
 * user progresses through the app.
 *
 * Gamification state is independent of fasting and weight states. While
 * fasting and weight events may trigger gamification changes, the rules
 * for awarding streaks, XP, levels, and Anchors belong here.
 */
export const useGamification = (): UseGamificationResult => {
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [anchors, setAnchors] = useState(INITIAL_ANCHORS)
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const queueAchievement = (achievement: Achievement) => {
    setAchievements((prev) => [...prev, achievement])
  }

  const awardXp = (amount: number) => {
    setXp((prev) => {
      const next = prev + amount
      const previousLevel = getLevelForXp(prev)
      const nextLevel = getLevelForXp(next)

      if (nextLevel > previousLevel) {
        queueAchievement({
          type: 'level',
          title: `Level ${nextLevel} reached!`,
          description:
            'Keep going. Every fast brings you closer to your next milestone.',
        })
      }

      return next
    })
  }

  const awardAnchor = () => {
    setAnchors((prev) => prev + 1)

    queueAchievement({
      type: 'anchor',
      title: 'Anchor earned!',
      description: 'You earned an Anchor by maintaining your fasting streak.',
    })
  }

  const spendAnchor = () => {
    setAnchors((prev) => {
      if (prev < 1) return prev
      return prev - 1
    })
  }

  const incrementStreak = () => {
    setStreak((prev) => {
      const next = prev + 1

      if (shouldCelebrateStreak(next)) {
        queueAchievement({
          type: 'streak',
          title: `${next} day streak!`,
          description:
            'Your consistency is paying off. Keep the momentum going!',
        })
      }

      return next
    })
  }

  const dismissAchievement = () => {
    setAchievements((prev) => prev.slice(1))
  }

  const resetStreak = () => {
    setStreak(0)
  }

  const hydrateXp = () => {
    try {
      const saved = localStorage.getItem(XP_STORAGE_KEY)
      if (!saved) return

      const xp = JSON.parse(saved) as number

      const isValidXp = typeof xp === 'number'

      if (!isValidXp) {
        throw Error('XP in local storage corrupted')
      }

      setXp(xp)
    } catch (error) {
      console.error('Hydrating xp from local storage failed', error)
      localStorage.removeItem(XP_STORAGE_KEY)
    }
  }

  const hydrateStreak = () => {
    try {
      const saved = localStorage.getItem(STREAK_STORAGE_KEY)
      if (!saved) return

      const streak = JSON.parse(saved) as number

      const isValidStreak = typeof streak === 'number'

      if (!isValidStreak) {
        throw Error('Streak in local storage corrupted')
      }

      setStreak(streak)
    } catch (error) {
      console.error('Hydrating streak from local storage failed', error)
      localStorage.removeItem(STREAK_STORAGE_KEY)
    }
  }

  const hydrateAnchors = () => {
    try {
      const saved = localStorage.getItem(ANCHORS_STORAGE_KEY)
      if (!saved) return

      const anchors = JSON.parse(saved) as number

      const isValidAnchors = typeof anchors === 'number'

      if (!isValidAnchors) {
        throw Error('Anchors in local storage corrupted')
      }

      setAnchors(anchors)
    } catch (error) {
      console.error('Hydrating anchors from local storage failed', error)
      localStorage.removeItem(ANCHORS_STORAGE_KEY)
    }
  }

  useEffect(() => {
    const hydrate = () => {
      try {
        hydrateXp()
        hydrateStreak()
        hydrateAnchors()
      } finally {
        setIsLoading(false)
      }
    }

    hydrate()
  }, [])

  useEffect(() => {
    if (isLoading) return

    const syncXp = () => {
      localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(xp))
    }

    syncXp()
  }, [isLoading, xp])

  useEffect(() => {
    if (isLoading) return

    const syncStreak = () => {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streak))
    }

    syncStreak()
  }, [isLoading, streak])

  useEffect(() => {
    if (isLoading) return

    const syncAnchors = () => {
      localStorage.setItem(ANCHORS_STORAGE_KEY, JSON.stringify(anchors))
    }

    syncAnchors()
  }, [anchors, isLoading])

  return {
    xp,
    streak,
    anchors,
    awardXp,
    isLoading,
    awardAnchor,
    spendAnchor,
    resetStreak,
    incrementStreak,
    dismissAchievement,
    currentAchievement: achievements[0] ?? null,
  }
}
