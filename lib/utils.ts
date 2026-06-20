import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a value with singular/plural labels.
 */
export const pluralize = (
  value: number,
  singular: string,
  plural = `${singular}s`,
) => {
  return `${value} ${value === 1 ? singular : plural}`
}
