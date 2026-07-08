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
import type { FastingPlanId } from '@/types/fasting'
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
      return 'border border-green-500/20'

    case 'missed':
      return 'border border-destructive/30'

    case 'anchored':
      return 'border border-primary/30'
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
      return 'oklch(62.7% 0.194 149.214)'

    case 'anchored':
      return 'var(--primary)'

    case 'missed':
      return 'var(--destructive)'
  }
}
