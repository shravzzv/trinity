'use client'

import { getLevelForXp } from '@/lib/gamification'
import { useState } from 'react'

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
   * The user's current level.
   */
  level: number

  /**
   * The user's current consecutive streak.
   */
  streak: number

  /**
   * The number of unused Anchors available.
   */
  anchors: number

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
  const [anchors, setAnchors] = useState(0)

  const level = getLevelForXp(xp)

  const awardXp = (amount: number) => {
    setXp((prev) => prev + amount)
  }

  const awardAnchor = () => {
    setAnchors((prev) => prev + 1)
  }

  const spendAnchor = () => {
    if (anchors < 1) return
    setAnchors((prev) => prev - 1)
  }

  const incrementStreak = () => {
    setStreak((prev) => prev + 1)
  }

  const resetStreak = () => {
    setStreak(0)
  }

  return {
    xp,
    level,
    streak,
    anchors,
    awardXp,
    awardAnchor,
    spendAnchor,
    resetStreak,
    incrementStreak,
  }
}
