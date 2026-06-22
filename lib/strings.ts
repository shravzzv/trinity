/**
 * String and text utilities.
 *
 * This module contains helpers for formatting, transforming, and
 * generating human-readable text. Functions in this file should be
 * domain-agnostic and reusable across the application.
 *
 * Examples:
 *
 * - Pluralizing words.
 * - Capitalizing text.
 * - Truncating strings.
 * - Formatting labels and display text.
 * - Other generic string manipulation operations.
 *
 * Avoid placing business logic in this module. Domain-specific text
 * formatting should live alongside the domain it belongs to.
 */

/**
 * Formats a numeric value with the appropriate singular or plural label.
 *
 * When a custom plural form is not provided, an `"s"` is appended to
 * the singular label.
 *
 * Examples:
 *
 * - `pluralize(1, 'fast')` → `"1 fast"`
 * - `pluralize(2, 'fast')` → `"2 fasts"`
 * - `pluralize(2, 'person', 'people')` → `"2 people"`
 *
 * @param value The numeric value to format.
 * @param singular The singular form of the label.
 * @param plural The plural form of the label. Defaults to `${singular}s`.
 * @returns A formatted string containing the value and label.
 */
export const pluralize = (
  value: number,
  singular: string,
  plural = `${singular}s`,
) => {
  return `${value} ${value === 1 ? singular : plural}`
}
