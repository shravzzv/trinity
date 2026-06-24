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

import type { Fast, FastingStatisticsCadence } from '@/types/fasting'

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
