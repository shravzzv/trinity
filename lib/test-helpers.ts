/**
 * @fileoverview Provides reusable test helper functions.
 *
 * This module contains utilities intended for use across test files.
 * It centralizes common test data creation to reduce duplication and
 * keep tests focused on the behavior being tested.
 */

import type { StreakHistoryItem } from '@/types/gamification'
import { v4 as uuidv4 } from 'uuid'

/**
 * Creates a streak history item with default values.
 *
 * Properties provided through `overrides` replace the corresponding
 * defaults.
 *
 * @param overrides - Optional properties to override the default values.
 * @return A streak history item suitable for testing.
 */
export const createStreakHistoryItem = (
  overrides: Partial<StreakHistoryItem> = {},
): StreakHistoryItem => ({
  id: uuidv4(),
  date: new Date(),
  needsSync: false,
  status: 'completed',
  ...overrides,
})
