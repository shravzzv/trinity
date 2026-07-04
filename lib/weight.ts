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

/**
 * Returns the subset of weight entries that fall within the given
 * statistics cadence.
 *
 * Cadences are relative to the current date:
 *
 * - week: last 7 days
 * - month: last month
 * - year: last year
 * - all: every recorded entry
 *
 * The returned array preserves the original ordering.
 *
 * @param entries The weight entries to filter.
 * @param cadence The reporting cadence.
 * @returns The weight entries that belong to the requested cadence.
 */
export const filterWeightEntriesByCadence = (
  entries: WeightEntry[],
  cadence: WeightStatisticsCadence,
): WeightEntry[] => {
  if (cadence === 'all') return entries

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

/**
 * Summary statistics describing a collection of weight entries.
 */
interface WeightStatistics {
  filteredEntries: WeightEntry[]
  currentWeight: number | null
  lowestWeight: number | null
  highestWeight: number | null
  weightChange: number | null
}

/**
 * Calculates summary statistics for a collection of weight entries.
 *
 * The entries are first filtered according to the requested cadence
 * before computing aggregate values.
 *
 * @param entries The complete collection of weight entries.
 * @param cadence The reporting cadence.
 * @returns Summary statistics for the filtered entries.
 */
export const getWeightStatistics = (
  entries: WeightEntry[],
  cadence: WeightStatisticsCadence,
): WeightStatistics => {
  const filteredEntries = filterWeightEntriesByCadence(entries, cadence)
  const currentWeight = filteredEntries.at(-1)?.weightKg ?? null

  const lowestWeight =
    filteredEntries.length === 0
      ? null
      : Math.min(...filteredEntries.map((e) => e.weightKg))

  const highestWeight =
    filteredEntries.length === 0
      ? null
      : Math.max(...filteredEntries.map((e) => e.weightKg))

  const weightChange =
    filteredEntries.length < 2
      ? null
      : currentWeight! - filteredEntries[0].weightKg

  return {
    filteredEntries,
    currentWeight,
    lowestWeight,
    highestWeight,
    weightChange,
  }
}

/**
 * Progress toward the user's target weight.
 */
interface TargetProgress {
  reached: boolean
  remainingWeight: number
}

/**
 * Computes progress toward a target weight.
 *
 * Returns `null` when either the current weight or target weight
 * is unavailable.
 *
 * @param currentWeight The user's current weight.
 * @param targetWeight The desired target weight.
 * @returns Progress information, or `null` if it cannot be determined.
 */
export const getTargetProgress = (
  currentWeight: number | null,
  targetWeight: number | null,
): TargetProgress | null => {
  if (currentWeight === null || targetWeight === null) return null
  const remainingWeight = currentWeight - targetWeight

  return {
    reached: remainingWeight <= 0,
    remainingWeight: Math.max(0, remainingWeight),
  }
}

/**
 * Formats a weight value for display.
 *
 * Unknown weights are rendered as an em dash.
 *
 * Examples:
 *
 * - 72.4 -> "72.4 kg"
 * - null -> "—"
 *
 * @param weight The weight to format.
 * @returns A human-readable weight string.
 */
export const formatWeight = (weight: number | null) => {
  return weight === null ? '—' : `${weight.toFixed(1)} kg`
}
