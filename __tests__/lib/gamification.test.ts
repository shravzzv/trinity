import { getStreakStatus } from '@/lib/gamification'

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
