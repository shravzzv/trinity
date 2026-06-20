// todo: better naming? It only checks for pluralizing. pluralizeHours?
/**
 * Pluralizes hours if needed and returns it as a string.
 *
 * @param hours The number of hours to format.
 * @returns The formatted hours as singular or plural hours.
 */
export const formatHours = (hours: number) => {
  return `${hours} hour${hours === 1 ? '' : 's'}`
}

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
