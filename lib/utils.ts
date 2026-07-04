/**
 * ShadCN utility module.
 *
 * This file contains framework-level utilities used by ShadCN UI
 * components and related styling infrastructure.
 *
 * The primary responsibility of this module is to expose the `cn`
 * helper for composing and merging Tailwind CSS class names.
 *
 * Avoid adding application-specific utilities to this file. Prefer
 * placing new utilities in dedicated modules such as:
 *
 * - `lib/strings.ts`
 * - `lib/time.ts`
 * - `lib/fasting.ts`
 *
 * This file should remain compatible with ShadCN's conventions and
 * may be updated or referenced by generated ShadCN components.
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
