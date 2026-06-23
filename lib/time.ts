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

/**
 * Returns a new Date with its time components replaced.
 *
 * The original date is not mutated.
 *
 * @param date The date whose time should be replaced.
 * @param hours The new hour value.
 * @param minutes The new minute value.
 * @param seconds The new second value.
 * @returns A new Date with the specified time.
 */
export const replaceTime = (
  date: Date,
  hours: number,
  minutes: number,
  seconds: number,
): Date => {
  const result = new Date(date)
  result.setHours(hours)
  result.setMinutes(minutes)
  result.setSeconds(seconds)
  return result
}

/**
 * Returns a new Date with its time replaced using the value from a
 * HTML time input.
 *
 * Supports both `HH:mm` and `HH:mm:ss` formats.
 *
 * The original date is not mutated.
 *
 * @param date The date whose time should be replaced.
 * @param inputValue A time string from an HTML time input.
 * @returns A new Date with the parsed time applied.
 */
export const replaceTimeFromInputValue = (
  date: Date,
  inputValue: string,
): Date => {
  const [hours, minutes, seconds = 0] = inputValue.split(':').map(Number)
  return replaceTime(date, hours, minutes, seconds)
}

/**
 * Returns a new Date whose date components come from one Date and whose
 * time components come from another Date.
 *
 * Useful when a user selects a new calendar date but the existing time
 * should be preserved.
 *
 * The original dates are not mutated.
 *
 * @param targetDate The Date that provides the year, month, and day.
 * @param sourceDate The Date that provides the time components.
 * @returns A new Date containing the selected date and preserved time.
 */
export const copyTime = (targetDate: Date, sourceDate: Date): Date => {
  return replaceTime(
    targetDate,
    sourceDate.getHours(),
    sourceDate.getMinutes(),
    sourceDate.getSeconds(),
  )
}
