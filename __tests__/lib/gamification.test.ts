import { ANCHOR_STREAK_REQUIREMENT } from '@/constants/gamification'
import {
  getLevelForXp,
  getLevelProgress,
  getLongestStreak,
  getStreakCalendarDates,
  getStreakCalendarDays,
  getStreakCounters,
  getStreakStatus,
  shouldAwardAnchor,
  shouldCelebrateStreak,
} from '@/lib/gamification'
import { createStreakHistoryItem } from '@/lib/test-helpers'
import type { Fast } from '@/types/fasting'
import type { StreakHistoryItem, StreakStatus } from '@/types/gamification'

describe('getStreakStatus', () => {
  it('returns anchored when an Anchor was used', () => {
    expect(
      getStreakStatus({
        planId: '23:1',
        startedAt: new Date('2026-01-01T00:00:00Z'),
        endedAt: new Date('2026-01-01T01:00:00Z'),
        isAnchored: true,
      }),
    ).toBe('anchored')
  })

  it('returns completed when the fast reaches the required duration', () => {
    expect(
      getStreakStatus({
        planId: '16:8',
        startedAt: new Date('2026-01-01T00:00:00Z'),
        endedAt: new Date('2026-01-01T16:00:00Z'),
        isAnchored: false,
      }),
    ).toBe('completed')
  })

  it('returns completed when the fast exceeds the required duration', () => {
    expect(
      getStreakStatus({
        planId: '16:8',
        startedAt: new Date('2026-01-01T00:00:00Z'),
        endedAt: new Date('2026-01-01T18:00:00Z'),
        isAnchored: false,
      }),
    ).toBe('completed')
  })

  it('returns missed when the fast ends before the required duration', () => {
    expect(
      getStreakStatus({
        planId: '16:8',
        startedAt: new Date('2026-01-01T00:00:00Z'),
        endedAt: new Date('2026-01-01T15:59:59Z'),
        isAnchored: false,
      }),
    ).toBe('missed')
  })

  it('returns anchored even if the fast ended early', () => {
    expect(
      getStreakStatus({
        planId: '16:8',
        startedAt: new Date('2026-01-01T00:00:00Z'),
        endedAt: new Date('2026-01-01T01:00:00Z'),
        isAnchored: true,
      }),
    ).toBe('anchored')
  })
})

describe('getStreakCalendarDays', () => {
  it('groups completed fasts', () => {
    const result = getStreakCalendarDays([
      {
        id: '1',
        startedAt: '2026-07-01T18:00:00.000Z',
        endedAt: '2026-07-02T17:00:00.000Z',
        streakStatus: 'completed',
        planId: '23:1',
        needsSync: false,
        updatedAt: new Date().toISOString(),
      },
    ])

    expect(result.completed).toEqual([new Date('2026-07-02T17:00:00.000Z')])
    expect(result.missed).toEqual([])
    expect(result.anchored).toEqual([])
  })

  it('groups missed fasts', () => {
    const result = getStreakCalendarDays([
      {
        id: '1',
        startedAt: '2026-07-02T18:00:00.000Z',
        endedAt: '2026-07-03T12:00:00.000Z',
        streakStatus: 'missed',
        planId: '23:1',
        needsSync: false,
        updatedAt: new Date().toISOString(),
      },
    ])

    expect(result.completed).toEqual([])
    expect(result.missed).toEqual([new Date('2026-07-03T12:00:00.000Z')])
    expect(result.anchored).toEqual([])
  })

  it('groups anchored fasts', () => {
    const result = getStreakCalendarDays([
      {
        id: '1',
        startedAt: '2026-07-03T18:00:00.000Z',
        endedAt: '2026-07-04T17:00:00.000Z',
        streakStatus: 'anchored',
        planId: '23:1',
        needsSync: false,
        updatedAt: new Date().toISOString(),
      },
    ])

    expect(result.completed).toEqual([])
    expect(result.missed).toEqual([])
    expect(result.anchored).toEqual([new Date('2026-07-04T17:00:00.000Z')])
  })

  it('groups multiple fasts', () => {
    const result = getStreakCalendarDays([
      {
        id: '1',
        startedAt: '2026-07-01T18:00:00.000Z',
        endedAt: '2026-07-02T17:00:00.000Z',
        streakStatus: 'completed',
        planId: '23:1',
        needsSync: false,
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        startedAt: '2026-07-02T18:00:00.000Z',
        endedAt: '2026-07-03T10:00:00.000Z',
        streakStatus: 'missed',
        planId: '23:1',
        needsSync: false,
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        startedAt: '2026-07-03T18:00:00.000Z',
        endedAt: '2026-07-04T17:00:00.000Z',
        streakStatus: 'anchored',
        planId: '23:1',
        needsSync: false,
        updatedAt: new Date().toISOString(),
      },
    ])

    expect(result.completed).toHaveLength(1)
    expect(result.missed).toHaveLength(1)
    expect(result.anchored).toHaveLength(1)
  })
})

describe('getLevelForXp', () => {
  it('returns level 0 for 0 XP', () => {
    expect(getLevelForXp(0)).toBe(0)
  })

  it('returns level 0 for XP below the first threshold', () => {
    expect(getLevelForXp(99)).toBe(0)
  })

  it('returns level 1 at the first threshold', () => {
    expect(getLevelForXp(100)).toBe(1)
  })

  it('returns the highest unlocked level between thresholds', () => {
    expect(getLevelForXp(249)).toBe(1)
    expect(getLevelForXp(250)).toBe(2)

    expect(getLevelForXp(449)).toBe(2)
    expect(getLevelForXp(450)).toBe(3)

    expect(getLevelForXp(699)).toBe(3)
    expect(getLevelForXp(700)).toBe(4)
  })

  it('returns the highest configured level at the final threshold', () => {
    expect(getLevelForXp(1000)).toBe(5)
  })

  it('returns the highest configured level for XP beyond the final threshold', () => {
    expect(getLevelForXp(1500)).toBe(5)
    expect(getLevelForXp(Number.MAX_SAFE_INTEGER)).toBe(5)
  })

  it('returns 0 for an invalid Xp', () => {
    expect(getLevelForXp(-Infinity)).toBe(0)
  })
})

describe('getLongestStreak', () => {
  const createFast = ({
    streakStatus,
  }: {
    streakStatus: StreakStatus
  }): Fast => ({
    id: crypto.randomUUID(),
    planId: '16:8',
    startedAt: '2026-07-01T00:00:00.000Z',
    endedAt: '2026-07-01T16:00:00.000Z',
    streakStatus,
    needsSync: false,
    updatedAt: new Date().toISOString(),
  })

  it('returns 0 when there are no fasts', () => {
    expect(getLongestStreak([])).toBe(0)
  })

  it('returns the length of a streak of completed fasts', () => {
    expect(
      getLongestStreak([
        createFast({ streakStatus: 'completed' }),
        createFast({ streakStatus: 'completed' }),
        createFast({ streakStatus: 'completed' }),
      ]),
    ).toBe(3)
  })

  it('counts anchored fasts as part of a streak', () => {
    expect(
      getLongestStreak([
        createFast({ streakStatus: 'completed' }),
        createFast({ streakStatus: 'anchored' }),
        createFast({ streakStatus: 'completed' }),
      ]),
    ).toBe(3)
  })

  it('resets the current streak after a missed fast', () => {
    expect(
      getLongestStreak([
        createFast({ streakStatus: 'completed' }),
        createFast({ streakStatus: 'completed' }),
        createFast({ streakStatus: 'missed' }),
        createFast({ streakStatus: 'completed' }),
      ]),
    ).toBe(2)
  })

  it('returns the longest streak when multiple streaks exist', () => {
    expect(
      getLongestStreak([
        createFast({ streakStatus: 'completed' }),
        createFast({ streakStatus: 'missed' }),
        createFast({ streakStatus: 'completed' }),
        createFast({ streakStatus: 'anchored' }),
        createFast({ streakStatus: 'completed' }),
        createFast({ streakStatus: 'missed' }),
        createFast({ streakStatus: 'completed' }),
      ]),
    ).toBe(3)
  })

  it('returns 0 when all fasts are missed', () => {
    expect(
      getLongestStreak([
        createFast({ streakStatus: 'missed' }),
        createFast({ streakStatus: 'missed' }),
      ]),
    ).toBe(0)
  })
})

describe('getLevelProgress', () => {
  it('returns level 0 progress for a new user', () => {
    expect(getLevelProgress(0)).toEqual({
      currentLevel: 0,
      nextLevel: 1,
      progress: 0,
      xpRemaining: 100,
    })
  })

  it('calculates progress within level 0', () => {
    expect(getLevelProgress(50)).toEqual({
      currentLevel: 0,
      nextLevel: 1,
      progress: 50,
      xpRemaining: 50,
    })
  })

  it('returns 0% progress immediately after leveling up', () => {
    expect(getLevelProgress(100)).toEqual({
      currentLevel: 1,
      nextLevel: 2,
      progress: 0,
      xpRemaining: 150,
    })
  })

  it('calculates progress within an intermediate level', () => {
    expect(getLevelProgress(175)).toEqual({
      currentLevel: 1,
      nextLevel: 2,
      progress: 50,
      xpRemaining: 75,
    })
  })

  it('returns 100% progress at the maximum level', () => {
    expect(getLevelProgress(1000)).toEqual({
      currentLevel: 5,
      nextLevel: 5,
      progress: 100,
      xpRemaining: 0,
    })
  })

  it('returns 100% progress when XP exceeds the maximum level', () => {
    expect(getLevelProgress(5000)).toEqual({
      currentLevel: 5,
      nextLevel: 5,
      progress: 100,
      xpRemaining: 0,
    })
  })
})

describe('shouldAwardAnchor', () => {
  it('does not award an Anchor for a streak of zero', () => {
    expect(shouldAwardAnchor(0)).toBe(false)
  })

  it('does not award an Anchor before reaching the requirement', () => {
    expect(shouldAwardAnchor(ANCHOR_STREAK_REQUIREMENT - 1)).toBe(false)
  })

  it('awards an Anchor when the requirement is reached', () => {
    expect(shouldAwardAnchor(ANCHOR_STREAK_REQUIREMENT)).toBe(true)
  })

  it('does not award an Anchor between milestones', () => {
    expect(shouldAwardAnchor(ANCHOR_STREAK_REQUIREMENT + 1)).toBe(false)
  })

  it('awards an Anchor at subsequent multiples of the requirement', () => {
    expect(shouldAwardAnchor(ANCHOR_STREAK_REQUIREMENT * 2)).toBe(true)
    expect(shouldAwardAnchor(ANCHOR_STREAK_REQUIREMENT * 3)).toBe(true)
  })
})

describe('shouldCelebrateStreak', () => {
  it('celebrates a 7 day streak', () => {
    expect(shouldCelebrateStreak(7)).toBe(true)
  })

  it('celebrates a 25 day streak', () => {
    expect(shouldCelebrateStreak(25)).toBe(true)
  })

  it('celebrates a 50 day streak', () => {
    expect(shouldCelebrateStreak(50)).toBe(true)
  })

  it('celebrates every 100 day milestone', () => {
    expect(shouldCelebrateStreak(100)).toBe(true)
    expect(shouldCelebrateStreak(200)).toBe(true)
    expect(shouldCelebrateStreak(300)).toBe(true)
    expect(shouldCelebrateStreak(1000)).toBe(true)
  })

  it('does not celebrate non-milestone streaks', () => {
    expect(shouldCelebrateStreak(0)).toBe(false)
    expect(shouldCelebrateStreak(1)).toBe(false)
    expect(shouldCelebrateStreak(6)).toBe(false)
    expect(shouldCelebrateStreak(8)).toBe(false)
    expect(shouldCelebrateStreak(24)).toBe(false)
    expect(shouldCelebrateStreak(26)).toBe(false)
    expect(shouldCelebrateStreak(49)).toBe(false)
    expect(shouldCelebrateStreak(51)).toBe(false)
    expect(shouldCelebrateStreak(99)).toBe(false)
    expect(shouldCelebrateStreak(101)).toBe(false)
    expect(shouldCelebrateStreak(150)).toBe(false)
    expect(shouldCelebrateStreak(299)).toBe(false)
  })
})

describe('getStreakCounters', () => {
  it('should return 0s initially', () => {
    const { currentStreak, longestStreak } = getStreakCounters([])

    expect(currentStreak).toBe(0)
    expect(longestStreak).toBe(0)
  })

  it(`should show current and longest streaks as 1 after first completed fast`, () => {
    const streakHistory: StreakHistoryItem[] = [createStreakHistoryItem()]

    const { currentStreak, longestStreak } = getStreakCounters(streakHistory)

    expect(currentStreak).toBe(1)
    expect(longestStreak).toBe(1)
  })

  it(`should show the counters as 10 when there are 10 straight completed fast`, () => {
    const streakHistory: StreakHistoryItem[] = Array.from({ length: 10 }).map(
      () => createStreakHistoryItem(),
    )

    const { currentStreak, longestStreak } = getStreakCounters(streakHistory)

    expect(currentStreak).toBe(10)
    expect(longestStreak).toBe(10)
  })

  it('should reset current streak to 0 when a missed fast happens', () => {
    const streakHistory: StreakHistoryItem[] = [
      createStreakHistoryItem(),
      createStreakHistoryItem({ status: 'missed' }),
    ]

    const { currentStreak } = getStreakCounters(streakHistory)

    expect(currentStreak).toBe(0)
  })

  it('should start current streak from the last missed fast', () => {
    const streakHistory = [
      ...Array.from({ length: 10 }, () => createStreakHistoryItem()),
      createStreakHistoryItem({ status: 'missed' }),
      ...Array.from({ length: 5 }, () => createStreakHistoryItem()),
    ]

    const { currentStreak } = getStreakCounters(streakHistory)

    expect(currentStreak).toBe(5)
  })

  it('should preserve longest strek when a new current streak beings', () => {
    const streakHistory = [
      ...Array.from({ length: 10 }, () => createStreakHistoryItem()),
      createStreakHistoryItem({ status: 'missed' }),
      createStreakHistoryItem(),
    ]

    const { currentStreak, longestStreak } = getStreakCounters(streakHistory)

    expect(currentStreak).toBe(1)
    expect(longestStreak).toBe(10)
  })

  it('should increment current streak for an anchored fast', () => {
    const history = [
      createStreakHistoryItem({ status: 'completed' }),
      createStreakHistoryItem({ status: 'anchored' }),
      createStreakHistoryItem({ status: 'completed' }),
    ]

    const { currentStreak, longestStreak } = getStreakCounters(history)

    expect(currentStreak).toBe(3)
    expect(longestStreak).toBe(3)
  })

  it('should calculate streaks in chronological order', () => {
    const history = [
      createStreakHistoryItem({
        date: new Date('2026-11-11'),
      }),
      createStreakHistoryItem({
        date: new Date('2026-11-09'),
        status: 'missed',
      }),
      createStreakHistoryItem({
        date: new Date('2026-11-10'),
      }),
    ]

    const { currentStreak, longestStreak } = getStreakCounters(history)

    expect(currentStreak).toBe(2)
    expect(longestStreak).toBe(2)
  })

  it('should not require consecutive calendar days', () => {
    const history = [
      createStreakHistoryItem({
        date: new Date('2026-11-01'),
      }),
      createStreakHistoryItem({
        date: new Date('2026-11-05'),
      }),
      createStreakHistoryItem({
        date: new Date('2026-11-11'),
      }),
    ]

    const { currentStreak, longestStreak } = getStreakCounters(history)

    expect(currentStreak).toBe(3)
    expect(longestStreak).toBe(3)
  })

  it('should process multiple outcomes on the same date chronologically', () => {
    const history = [
      createStreakHistoryItem({
        date: new Date('2026-11-11T12:00:00Z'),
        status: 'missed',
      }),
      createStreakHistoryItem({
        date: new Date('2026-11-11T10:00:00Z'),
      }),
    ]

    const { currentStreak, longestStreak } = getStreakCounters(history)

    expect(currentStreak).toBe(0)
    expect(longestStreak).toBe(1)
  })
})

describe('getStreakCalendarDates', () => {
  it('should return empty arrays when history is empty', () => {
    const { missed, anchored, completed } = getStreakCalendarDates([])

    expect(missed).toEqual([])
    expect(anchored).toEqual([])
    expect(completed).toEqual([])
  })

  it('should group dates by their recorded status', () => {
    const history = [
      createStreakHistoryItem({
        date: new Date('2026-11-09T10:00:00.000Z'),
        status: 'completed',
      }),
      createStreakHistoryItem({
        date: new Date('2026-11-10T10:00:00.000Z'),
        status: 'missed',
      }),
      createStreakHistoryItem({
        date: new Date('2026-11-11T10:00:00.000Z'),
        status: 'anchored',
      }),
    ]

    const { missed, anchored, completed } = getStreakCalendarDates(history)

    expect(missed).toEqual([history[1].date])
    expect(anchored).toEqual([history[2].date])
    expect(completed).toEqual([history[0].date])
  })

  it('should sort dates chronologically within each group', () => {
    const history = [
      createStreakHistoryItem({
        date: new Date('2026-11-11'),
      }),
      createStreakHistoryItem({
        date: new Date('2026-11-09'),
      }),
      createStreakHistoryItem({
        date: new Date('2026-11-10'),
      }),
    ]

    const { completed } = getStreakCalendarDates(history)

    expect(completed).toEqual([
      history[1].date,
      history[2].date,
      history[0].date,
    ])
  })

  it('should preserve multiple outcomes recorded on the same date', () => {
    const date = new Date('2026-11-11T10:00:00.000Z')

    const history = [
      createStreakHistoryItem({ date, status: 'completed' }),
      createStreakHistoryItem({ date, status: 'missed' }),
      createStreakHistoryItem({ date, status: 'anchored' }),
    ]

    const { missed, anchored, completed } = getStreakCalendarDates(history)

    expect(missed).toEqual([date])
    expect(anchored).toEqual([date])
    expect(completed).toEqual([date])
  })

  it('should not modify the original streak history', () => {
    const history = [
      createStreakHistoryItem({
        date: new Date('2026-11-11T10:00:00.000Z'),
      }),
      createStreakHistoryItem({
        date: new Date('2026-11-09T10:00:00.000Z'),
      }),
    ]

    const originalOrder = [...history]

    getStreakCalendarDates(history)

    expect(history).toEqual(originalOrder)
  })
})
