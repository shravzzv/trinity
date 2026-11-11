/**
 * @fileoverview Tests for reusable test helper functions.
 *
 * Verifies that test helpers create valid test data with the expected
 * default values and correctly apply custom overrides.
 */

import { createStreakHistoryItem } from '@/lib/test-helpers'

describe('createStreakHistoryItem', () => {
  it('should create a streak history item with default values', () => {
    const item = createStreakHistoryItem()

    expect(item).toEqual({
      id: expect.any(String),
      date: expect.any(Date),
      needsSync: false,
      status: 'completed',
    })
  })

  it('should override default values', () => {
    const overrides = {
      id: 'custom-id',
      date: new Date('2026-11-11T10:00:00.000Z'),
      needsSync: true,
      status: 'missed' as const,
    }

    const item = createStreakHistoryItem(overrides)

    expect(item).toEqual(overrides)
  })
})
