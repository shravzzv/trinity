import { ANCHOR_STREAK_REQUIREMENT } from '@/constants/gamification'
import {
  getLevelForXp,
  getLevelProgress,
  getLongestStreak,
  getStreakCalendarDays,
  getStreakStatus,
  shouldAwardAnchor,
  shouldCelebrateStreak,
} from '@/lib/gamification'
import type { Fast } from '@/types/fasting'
import type { StreakStatus } from '@/types/gamification'

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
      },
    ])

    expect(result.completed).toEqual([new Date('2026-07-01T18:00:00.000Z')])
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
      },
    ])

    expect(result.completed).toEqual([])
    expect(result.missed).toEqual([new Date('2026-07-02T18:00:00.000Z')])
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
      },
    ])

    expect(result.completed).toEqual([])
    expect(result.missed).toEqual([])
    expect(result.anchored).toEqual([new Date('2026-07-03T18:00:00.000Z')])
  })

  it('groups multiple fasts', () => {
    const result = getStreakCalendarDays([
      {
        id: '1',
        startedAt: '2026-07-01T18:00:00.000Z',
        endedAt: '2026-07-02T17:00:00.000Z',
        streakStatus: 'completed',
        planId: '23:1',
      },
      {
        id: '2',
        startedAt: '2026-07-02T18:00:00.000Z',
        endedAt: '2026-07-03T10:00:00.000Z',
        streakStatus: 'missed',
        planId: '23:1',
      },
      {
        id: '3',
        startedAt: '2026-07-03T18:00:00.000Z',
        endedAt: '2026-07-04T17:00:00.000Z',
        streakStatus: 'anchored',
        planId: '23:1',
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
