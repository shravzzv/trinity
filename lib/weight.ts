/**
 * Weight domain utilities.
 *
 * This module contains business logic and calculations related to
 * body weight tracking. Functions in this file may depend on Trinity
 * domain models such as {@link WeightEntry} and {@link WeightState}.
 *
 * Examples:
 *
 * - Sorting weight entries.
 * - Calculating weight statistics.
 * - Computing weight trends and changes.
 * - Determining progress toward a target weight.
 * - Other weight tracking rules and calculations.
 *
 * Prefer placing weight-related logic here rather than inside React
 * components so it can be reused, tested, and evolved independently
 * of the user interface.
 */

import type { WeightEntry, WeightStatisticsCadence } from '@/types/weight'

/**
 * Returns the given weight entries sorted in ascending chronological order
 * without mutating the input array.
 *
 * Entries are ordered from the oldest recorded weight to the most recent
 * based on their `recordedAt` timestamps.
 *
 * @param entries The weight entries to sort.
 * @returns The weight entries sorted by ascending recording date.
 */
export const sortWeightEntries = (entries: WeightEntry[]) => {
  return [...entries].sort(
    (a, b) =>
      new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
  )
}

export const filterWeightEntriesByCadence = (
  entries: WeightEntry[],
  cadence: WeightStatisticsCadence,
): WeightEntry[] => {
  if (cadence === 'all') {
    return entries
  }

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

  return entries.filter((entry) => new Date(entry.recordedAt) >= cutoff)
}
