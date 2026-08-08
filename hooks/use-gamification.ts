'use client'

import { INITIAL_ANCHORS } from '@/constants/gamification'
import { getLevelForXp, shouldCelebrateStreak } from '@/lib/gamification'
import { getProfile, updateProfile } from '@/lib/profile'
import { requestSync } from '@/lib/sync'
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

  const dismissAchievement = () => {
    setAchievements((prev) => prev.slice(1))
  }

  const awardXp = (amount: number) => {
    const previousXp = getProfile().xp

    const updatedProfile = updateProfile((profile) => ({
      ...profile,
      xp: profile.xp + amount,
      needsSync: true,
    }))

    const nextXp = updatedProfile.xp
    const previousLevel = getLevelForXp(previousXp)
    const nextLevel = getLevelForXp(nextXp)

    setXp(nextXp)

    if (nextLevel > previousLevel) {
      queueAchievement({
        type: 'level',
        title: `Level ${nextLevel} reached!`,
        description:
          'Keep going. Every fast brings you closer to your next milestone.',
      })
    }

    void requestSync()
  }

  const awardAnchor = () => {
    const updatedProfile = updateProfile((profile) => ({
      ...profile,
      anchors: profile.anchors + 1,
      needsSync: true,
    }))

    setAnchors(updatedProfile.anchors)

    queueAchievement({
      type: 'anchor',
      title: 'Anchor earned!',
      description: 'You earned an Anchor by maintaining your fasting streak.',
    })

    void requestSync()
  }

  const spendAnchor = () => {
    const updatedProfile = updateProfile((profile) => ({
      ...profile,
      anchors: Math.max(profile.anchors - 1, 0),
      needsSync: true,
    }))

    setAnchors(updatedProfile.anchors)

    void requestSync()
  }

  const incrementStreak = () => {
    const updatedProfile = updateProfile((profile) => ({
      ...profile,
      streak: profile.streak + 1,
      needsSync: true,
    }))

    const nextStreak = updatedProfile.streak
    setStreak(nextStreak)

    if (shouldCelebrateStreak(nextStreak)) {
      queueAchievement({
        type: 'streak',
        title: `${nextStreak} day streak!`,
        description: 'Your consistency is paying off. Keep the momentum going!',
      })
    }

    void requestSync()
  }

  const resetStreak = () => {
    const updatedProfile = updateProfile((profile) => ({
      ...profile,
      streak: 0,
      needsSync: true,
    }))

    setStreak(updatedProfile.streak)

    void requestSync()
  }

  const hydrateProfile = () => {
    const profile = getProfile()

    setXp(profile.xp)
    setStreak(profile.streak)
    setAnchors(profile.anchors)
  }

  useEffect(() => {
    const hydrate = async () => {
      try {
        hydrateProfile()

        await requestSync()
        hydrateProfile()
      } finally {
        setIsLoading(false)
      }
    }

    hydrate()
  }, [])

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
