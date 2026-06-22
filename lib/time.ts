/**
 * Time-related utilities.
 *
 * This module contains generic helpers for working with dates, times,
 * durations, and timestamps. Functions in this file should be reusable
 * across the application and should not depend on any Trinity-specific
 * domain concepts.
 *
 * Examples:
 *
 * - Converting between time units.
 * - Formatting dates and durations.
 * - Calculating elapsed time.
 * - Determining whether a timestamp falls within a time range.
 * - Other domain-agnostic date and time operations.
 */

/**
 * Returns a HH:MM:SS version of a duration.
 *
 * @param ms The duration **in milliseconds**.
 * @returns A string in the format HH:MM:SS with 0s padded if needed.
 */
export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':')
}
