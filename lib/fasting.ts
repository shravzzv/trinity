/**
 * Fasting domain utilities.
 *
 * This module contains business logic and calculations related to
 * intermittent fasting. Functions in this file may depend on Trinity
 * domain models such as {@link Fast}, {@link FastingSession}, and
 * {@link FastingPlanId}.
 *
 * Examples:
 *
 * - Calculating fast durations.
 * - Computing fasting statistics.
 * - Determining streaks and milestones.
 * - Evaluating fasting progress.
 * - Other fasting-specific rules and calculations.
 *
 * Prefer placing fasting-related logic here rather than inside React
 * components so it can be reused, tested, and evolved independently
 * of the user interface.
 */

import { fastingPlans } from '@/constants/fasting-plans'
import type {
  Fast,
  FastingPlanId,
  FastingSession,
  FastingStatisticsCadence,
  PreferredFastStartTime,
} from '@/types/fasting'

/**
 * Calculates the duration of a completed fast in hours.
 *
 * The duration is derived from the difference between the fast's
 * `endedAt` and `startedAt` timestamps and returned as a decimal
 * number of hours.
 *
 * Examples:
 *
 * - 30 minutes → `0.5`
 * - 16 hours → `16`
 * - 16 hours 30 minutes → `16.5`
 *
 * @param fast The completed fast to calculate the duration for.
 * @returns The duration of the fast in hours.
 */
export const getFastDurationHours = (fast: Fast): number => {
  return (
    (new Date(fast.endedAt).getTime() - new Date(fast.startedAt).getTime()) /
    (1000 * 60 * 60)
  )
}

/**
 * Determines whether a candidate fast overlaps any existing fast.
 *
 * Two fasts are considered overlapping when any portion of their time
 * ranges intersect. Fasts whose boundaries touch exactly (for example,
 * one fast ending at 18:00 and another starting at 18:00) are not
 * considered overlapping.
 *
 * @param startedAt The start timestamp of the candidate fast.
 * @param endedAt The end timestamp of the candidate fast.
 * @param fasts The existing fasts to check against.
 *
 * @returns `true` if the candidate fast overlaps an existing fast;
 * otherwise `false`.
 */
export const doesFastOverlap = (
  startedAt: Date,
  endedAt: Date,
  fasts: Fast[],
): boolean => {
  return fasts.some((fast) => {
    const existingStartedAt = new Date(fast.startedAt)
    const existingEndedAt = new Date(fast.endedAt)

    return startedAt < existingEndedAt && endedAt > existingStartedAt
  })
}

/**
 * Returns any validation errors that prevent a candidate fast
 * from being added to the fasting history.
 *
 * Validation rules:
 *
 * - The start time must occur before the end time.
 * - The fast cannot end in the future.
 * - The fast cannot overlap an existing fast.
 *
 * @param startedAt The proposed fast start time.
 * @param endedAt The proposed fast end time.
 * @param fasts Existing fasts in the fasting history.
 * @returns A list of validation error messages. Returns an empty array when the fast is valid.
 */
export const getFastValidationErrors = (
  startedAt: Date,
  endedAt: Date,
  fasts: Fast[],
): string[] => {
  const errors: string[] = []

  if (startedAt >= endedAt) {
    errors.push('The start time must be before the end time.')
  }

  if (endedAt > new Date()) {
    errors.push('The fast cannot end in the future.')
  }

  if (doesFastOverlap(startedAt, endedAt, fasts)) {
    errors.push('The fast overlaps an existing fast.')
  }

  return errors
}

/**
 * Filters fasts to those that fall within the selected statistics cadence.
 *
 * The comparison is based on each fast's `startedAt` timestamp relative
 * to the current date and time.
 *
 * Cadence rules:
 *
 * - `week` — includes fasts started within the last 7 days.
 * - `month` — includes fasts started within the last month.
 * - `year` — includes fasts started within the last year.
 * - `all` — includes every fast.
 *
 * Fasts whose start timestamp falls exactly on the calculated cutoff
 * are included.
 *
 * @param fasts The fasting history to filter.
 * @param cadence The time range to include.
 * @returns A new array containing only the fasts that match the selected cadence.
 */
export const filterFastsByCadence = (
  fasts: Fast[],
  cadence: FastingStatisticsCadence,
): Fast[] => {
  return fasts.filter((fast) => {
    if (cadence === 'all') return true

    const startedAt = new Date(fast.startedAt)
    const cutoff = new Date()

    switch (cadence) {
      case 'week':
        cutoff.setDate(cutoff.getDate() - 7)
        break

      case 'month':
        cutoff.setMonth(cutoff.getMonth() - 1)
        break

      case 'year':
        cutoff.setFullYear(cutoff.getFullYear() - 1)
        break
    }

    return startedAt >= cutoff
  })
}

/**
 * Returns a new array of fasts sorted by their start time in ascending order
 * (oldest first).
 *
 * The original array is not modified.
 *
 * @param fasts The fasts to sort.
 * @returns A new array sorted chronologically by each fast's `startedAt` timestamp.
 */
export const sortFasts = (fasts: Fast[]) => {
  return [...fasts].sort(
    (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
  )
}

interface PreferredFastSchedule {
  startsAt: PreferredFastStartTime
  endsAt: PreferredFastStartTime
  endsNextDay: boolean
}

/**
 * Calculates the preferred fasting schedule from a preferred fasting
 * start time and fasting duration.
 *
 * The returned eating start time preserves the preferred start minute and
 * wraps around midnight when necessary.
 *
 * @param startTime The preferred fasting start time.
 * @param fastingHours The fasting duration in hours.
 * @returns The preferred fasting schedule.
 */
export const getPreferredFastSchedule = (
  startTime: PreferredFastStartTime,
  fastingHours: number,
): PreferredFastSchedule => {
  const totalHours = startTime.hour + fastingHours

  return {
    startsAt: {
      hour: startTime.hour,
      minute: startTime.minute,
    },
    endsAt: {
      hour: totalHours % 24,
      minute: startTime.minute,
    },
    endsNextDay: totalHours >= 24,
  }
}

/**
 * Formats a preferred time for presentation using the user's locale.
 *
 * The returned string uses a localized 12-hour or 24-hour clock depending
 * on the user's locale preferences.
 *
 * @param time The preferred time to format.
 * @returns The formatted time.
 */
export const formatPreferredTime = (time: PreferredFastStartTime): string => {
  const date = new Date()

  date.setHours(time.hour, time.minute, 0, 0)

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

/**
 * Returns whether an active fasting session beginning at {@link startedAt}
 * overlaps any completed fasts.
 *
 * Since an active session has no end time yet, the overlap is checked over
 * the interval from the proposed start time until the current time.
 *
 * @param startedAt The proposed session start time.
 * @param fasts Existing completed fasts.
 * @returns Whether the proposed session overlaps an existing fast.
 */
export const doesSessionOverlap = (startedAt: Date, fasts: Fast[]): boolean => {
  const now = new Date()
  return doesFastOverlap(startedAt, now, fasts)
}

/**
 * Returns any validation errors that prevent an active fasting session's
 * start time from being updated.
 *
 * Validation rules:
 *
 * - The session cannot start in the future.
 * - The session cannot overlap an existing completed fast.
 *
 * @param startedAt The proposed session start time.
 * @param fasts Existing completed fasts.
 * @returns A list of validation error messages. Returns an empty array when
 * the proposed session start time is valid.
 */
export const getSessionStartedAtValidationErrors = (
  startedAt: Date,
  fasts: Fast[],
): string[] => {
  const errors: string[] = []

  if (startedAt > new Date()) {
    errors.push('The session cannot start in the future.')
  }

  if (doesSessionOverlap(startedAt, fasts)) {
    errors.push('The session overlaps an existing fast.')
  }

  return errors
}

/**
 * Returns any validation errors that prevent a session's end time
 * from being updated.
 *
 * Validation rules:
 *
 * - The session must end after it starts.
 * - The session cannot end in the future.
 * - The resulting session cannot overlap another recorded session.
 *
 * @param startedAt The session start time.
 * @param endedAt The proposed session end time.
 * @param fasts Existing fasting history used to detect overlaps.
 * @returns A list of validation error messages. Returns an empty array when the end time is valid.
 */
export const getSessionEndedAtValidationErrors = (
  startedAt: Date,
  endedAt: Date,
  fasts: Fast[],
): string[] => {
  const errors: string[] = []

  if (startedAt >= endedAt) {
    errors.push('The session must end after it starts.')
  }

  if (endedAt > new Date()) {
    errors.push('The session cannot end in the future.')
  }

  if (doesFastOverlap(startedAt, endedAt, fasts)) {
    errors.push('This session overlaps another recorded session.')
  }

  return errors
}

/**
 * Derived values describing the current state of an active fasting or
 * eating session.
 */
interface ActiveSessionStatistics {
  /**
   * Whether the active session is a fasting session.
   */
  isFasting: boolean

  /**
   * Planned session length in milliseconds.
   */
  sessionLengthMs: number

  /**
   * Time remaining until the planned end of the session.
   *
   * Negative when the session has exceeded its planned duration.
   */
  remainingMs: number

  /**
   * Time elapsed beyond the planned session length.
   *
   * Zero or greater once the planned duration has been exceeded.
   */
  excessMs: number

  /**
   * Session progress as a percentage of the planned duration.
   *
   * Clamped to a maximum of 100.
   */
  progress: number

  /**
   * Planned end time based on the session start and fasting plan.
   */
  endsAt: Date

  /**
   * Whether the session has exceeded its planned duration.
   */
  hasExceededSessionLength: boolean

  /**
   * Formatted session start time for display.
   */
  startedAtFormatted: string

  /**
   * Formatted planned end time for display.
   */
  endsAtFormatted: string
}

interface GetActiveSessionStatisticsOptions {
  /**
   * The active fasting plan.
   */
  planId: FastingPlanId

  /**
   * Whether the current session is a fasting or eating session.
   */
  status: FastingSession['status']

  /**
   * When the current session started.
   */
  startedAt: Date

  /**
   * The current timestamp, in milliseconds since the Unix epoch.
   */
  now: number
}

/**
 * Computes the current state of an active fasting or eating session.
 *
 * Given the current session, fasting plan, and current time, this helper
 * derives all values needed to render the active timer UI, including:
 *
 * - remaining or exceeded duration
 * - progress percentage
 * - planned end time
 * - formatted timestamps
 * - whether the session has exceeded its planned length
 *
 * This function is pure and performs no side effects.
 *
 * @param options Configuration describing the active session.
 * @returns Derived statistics for rendering the active session timer.
 */
export const getActiveSessionStatistics = ({
  now,
  status,
  planId,
  startedAt,
}: GetActiveSessionStatisticsOptions): ActiveSessionStatistics => {
  const isFasting = status === 'fasting'

  const fastingPlan =
    fastingPlans.find((plan) => plan.id === planId) ?? fastingPlans[0]

  const sessionLengthHours = isFasting
    ? fastingPlan.fastingHours
    : fastingPlan.eatingHours

  const sessionLengthMs = sessionLengthHours * 60 * 60 * 1000
  const startedAtMs = startedAt.getTime()
  const elapsedMs = now - startedAtMs
  const remainingMs = sessionLengthMs - elapsedMs
  const progress = Math.min((elapsedMs / sessionLengthMs) * 100, 100)
  const endsAt = new Date(startedAtMs + sessionLengthMs)
  const hasExceededSessionLength = remainingMs < 0
  const excessMs = elapsedMs - sessionLengthMs
  const startedAtFormatted = startedAt.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
  const endsAtFormatted = endsAt.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })

  return {
    endsAt,
    progress,
    excessMs,
    isFasting,
    remainingMs,
    sessionLengthMs,
    endsAtFormatted,
    startedAtFormatted,
    hasExceededSessionLength,
  }
}
