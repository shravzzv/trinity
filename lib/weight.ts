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

import type { WeightEntry } from '@/types/weight'

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
