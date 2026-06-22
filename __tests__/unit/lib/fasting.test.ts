import { getFastDurationHours } from '@/lib/fasting'
import type { Fast } from '@/types/fasting'

describe('getFastDurationHours', () => {
  it('should return 0 for a fast with identical start and end times', () => {
    const fast: Fast = {
      id: '1',
      startedAt: '2026-01-01T00:00:00.000Z',
      endedAt: '2026-01-01T00:00:00.000Z',
    }

    expect(getFastDurationHours(fast)).toBe(0)
  })

  it('should return the duration in hours', () => {
    const fast: Fast = {
      id: '1',
      startedAt: '2026-01-01T00:00:00.000Z',
      endedAt: '2026-01-01T16:00:00.000Z',
    }

    expect(getFastDurationHours(fast)).toBe(16)
  })

  it('should return fractional hours for partial-hour durations', () => {
    const fast: Fast = {
      id: '1',
      startedAt: '2026-01-01T00:00:00.000Z',
      endedAt: '2026-01-01T16:30:00.000Z',
    }

    expect(getFastDurationHours(fast)).toBe(16.5)
  })

  it('should return durations smaller than one hour', () => {
    const fast: Fast = {
      id: '1',
      startedAt: '2026-01-01T00:00:00.000Z',
      endedAt: '2026-01-01T00:30:00.000Z',
    }

    expect(getFastDurationHours(fast)).toBe(0.5)
  })

  it('should return durations longer than 24 hours', () => {
    const fast: Fast = {
      id: '1',
      startedAt: '2026-01-01T00:00:00.000Z',
      endedAt: '2026-01-03T00:00:00.000Z',
    }

    expect(getFastDurationHours(fast)).toBe(48)
  })
})
