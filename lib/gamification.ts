/**
 * Gamification domain utilities.
 *
 * This module contains business logic and calculations related to
 * Trinity's gamification systems. Functions in this file may depend
 * on Trinity domain models such as {@link Fast},
 * {@link FastingSession}, {@link StreakStatus}, and
 * {@link FastingPlanId}.
 *
 * Examples:
 *
 * - Determining streak outcomes.
 * - Evaluating Anchor usage.
 * - Awarding and tracking XP.
 * - Calculating levels and progression.
 * - Unlocking rewards and milestones.
 * - Other gamification-specific rules and calculations.
 *
 * Prefer placing gamification-related logic here rather than inside
 * React components so it can be reused, tested, and evolved
 * independently of the user interface.
 */

import { fastingPlans } from '@/constants/fasting-plans'
import { ANCHOR_STREAK_REQUIREMENT, levels } from '@/constants/gamification'
import type { Fast, FastingPlanId } from '@/types/fasting'
import type { StreakStatus } from '@/types/gamification'

/**
 * Returns the streak outcome for a completed fasting session.
 *
 * A fasting session is:
 * - `anchored` if an Anchor was used.
 * - `missed` if it ended before the required fasting duration.
 * - `completed` otherwise.
 */
export const getStreakStatus = ({
  planId,
  endedAt,
  startedAt,
  isAnchored,
}: {
  endedAt: Date
  startedAt: Date
  isAnchored: boolean
  planId: FastingPlanId
}): StreakStatus => {
  if (isAnchored) return 'anchored'

  const plan = fastingPlans.find((p) => p.id === planId)!

  const expectedEndedAt = new Date(
    startedAt.getTime() + plan.fastingHours * 60 * 60 * 1000,
  )

  const endedEarly = endedAt.getTime() < expectedEndedAt.getTime()

  return endedEarly ? 'missed' : 'completed'
}

/**
 * Returns the border CSS classes associated with a fasting session's
 * streak outcome.
 *
 * This is a presentation helper used to visually distinguish completed,
 * missed, and anchored fasts throughout the UI. The returned classes can
 * be applied directly to cards, list items, or other containers that
 * represent a {@link StreakStatus}.
 *
 * Mapping:
 *
 * - `completed` → success-themed border.
 * - `missed` → destructive-themed border.
 * - `anchored` → primary-themed border.
 *
 * @param streakStatus The streak outcome to style.
 * @returns Tailwind CSS classes for the corresponding border styling.
 */
export const getStreakStatusBorderClasses = (
  streakStatus: StreakStatus,
): string => {
  switch (streakStatus) {
    case 'completed':
      return 'border border-primary/20'

    case 'missed':
      return 'border border-destructive/30'

    case 'anchored':
      return 'border border-anchor/30'
  }
}

/**
 * Returns the chart color associated with a streak outcome.
 *
 * This provides a consistent visual mapping between streak statuses
 * and their corresponding colors across charts and other data
 * visualizations.
 *
 * - `completed` → green
 * - `missed` → destructive
 * - `anchored` → primary
 */
export const getStreakStatusChartColor = (
  streakStatus: StreakStatus,
): string => {
  switch (streakStatus) {
    case 'completed':
      return 'var(--primary)'

    case 'missed':
      return 'var(--destructive)'

    case 'anchored':
      return 'var(--anchor)'
  }
}

/**
 * Groups completed fasts into calendar modifier arrays based on their
 * streak outcome.
 *
 * Each returned array contains the calendar day on which the fast
 * started. These arrays are intended to be passed directly to the
 * `modifiers` prop of the streak calendar.
 *
 * @param fasts The fasting history to group.
 * @returns Calendar day arrays for completed, missed, and anchored fasts.
 */
export const getStreakCalendarDays = (fasts: Fast[]) => {
  const missed: Date[] = []
  const anchored: Date[] = []
  const completed: Date[] = []

  for (const fast of fasts) {
    const day = new Date(fast.startedAt)

    switch (fast.streakStatus) {
      case 'completed':
        completed.push(day)
        break

      case 'missed':
        missed.push(day)
        break

      case 'anchored':
        anchored.push(day)
        break
    }
  }

  return {
    missed,
    anchored,
    completed,
  }
}

/**
 * Returns the highest unlocked level for the given amount of XP.
 *
 * Levels are unlocked once the user's XP meets or exceeds the
 * level's required XP threshold.
 *
 * @param xp The user's total experience points.
 * @returns The user's current level.
 */
export const getLevelForXp = (xp: number): number => {
  for (let i = levels.length - 1; i >= 0; i--) {
    const levelInfo = levels[i]

    if (xp >= levelInfo.requiredXp) {
      return levelInfo.level
    }
  }

  return 0
}

/**
 * Returns the longest streak contained in the provided fasting history.
 *
 * A streak is increased by both completed and anchored fasts, since
 * Anchors preserve streak continuity. Missed fasts end the current
 * streak and start a new one.
 *
 * The supplied fasts must be sorted in ascending chronological order.
 *
 * @param fasts The user's fasting history.
 * @returns The length of the longest streak.
 */
export const getLongestStreak = (fasts: Fast[]): number => {
  let currentStreak = 0
  let longestStreak = 0

  for (const fast of fasts) {
    switch (fast.streakStatus) {
      case 'completed':
      case 'anchored':
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
        break

      case 'missed':
        currentStreak = 0
        break
    }
  }

  return longestStreak
}

/**
 * Returns the user's progression towards the next level.
 *
 * Progression is calculated from the user's current XP relative to the
 * current level's XP threshold and the next level's XP threshold.
 *
 * Once the highest level has been reached, progress is fixed at 100%
 * and no further XP is required.
 *
 * @param xp The user's total experience points.
 * @returns An object containing:
 * - `currentLevel` — the user's current level.
 * - `nextLevel` — the next attainable level, or the current level if the maximum level has been reached.
 * - `progress` — percentage progress towards the next level.
 * - `xpRemaining` — XP still required to reach the next level.
 */
export const getLevelProgress = (xp: number) => {
  const currentLevel = getLevelForXp(xp)
  const maxLevel = levels.at(-1)!.level

  if (currentLevel === maxLevel) {
    return {
      currentLevel,
      nextLevel: maxLevel,
      progress: 100,
      xpRemaining: 0,
    }
  }

  const current = levels.find((l) => l.level === currentLevel)!
  const next = levels.find((l) => l.level === currentLevel + 1)!

  const progress =
    ((xp - current.requiredXp) / (next.requiredXp - current.requiredXp)) * 100

  return {
    progress,
    currentLevel,
    nextLevel: next.level,
    xpRemaining: next.requiredXp - xp,
  }
}

/**
 * Returns whether completing a fast with the given streak should award
 * an Anchor.
 *
 * An Anchor is awarded each time the user's completed-fast streak
 * reaches a multiple of {@link ANCHOR_STREAK_REQUIREMENT}.
 *
 * Anchored fasts are excluded from this calculation by the caller.
 *
 * @param streak The completed-fast streak after the current fast.
 * @returns Whether an Anchor should be awarded.
 */
export const shouldAwardAnchor = (streak: number): boolean => {
  return streak > 0 && streak % ANCHOR_STREAK_REQUIREMENT === 0
}

/**
 * Returns whether a streak should be celebrated.
 *
 * Celebrations occur at:
 * - 7 days
 * - 25 days
 * - 50 days
 * - every 100 days thereafter.
 *
 * @param streak The current streak length.
 * @returns Whether the streak reached a celebration milestone.
 */
export const shouldCelebrateStreak = (streak: number): boolean => {
  return (
    streak === 7 ||
    streak === 25 ||
    streak === 50 ||
    (streak >= 100 && streak % 100 === 0)
  )
}
