import { getStreakCalendarDays, getStreakStatus } from '@/lib/gamification'

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
