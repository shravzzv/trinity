import {
  getFastDurationHours,
  doesFastOverlap,
  getFastValidationErrors,
  filterFastsByCadence,
  sortFasts,
  formatPreferredTime,
  getPreferredFastSchedule,
} from '@/lib/fasting'
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

describe('doesFastOverlap', () => {
  const existingFast: Fast = {
    id: '1',
    startedAt: new Date(2026, 5, 20, 10, 0).toISOString(),
    endedAt: new Date(2026, 5, 20, 20, 0).toISOString(),
  }

  it('should return false when there are no existing fasts', () => {
    expect(
      doesFastOverlap(
        new Date(2026, 5, 20, 12, 0),
        new Date(2026, 5, 20, 18, 0),
        [],
      ),
    ).toBe(false)
  })

  it('should return false when the candidate fast is completely before an existing fast', () => {
    expect(
      doesFastOverlap(
        new Date(2026, 5, 20, 6, 0),
        new Date(2026, 5, 20, 9, 0),
        [existingFast],
      ),
    ).toBe(false)
  })

  it('should return false when the candidate fast is completely after an existing fast', () => {
    expect(
      doesFastOverlap(
        new Date(2026, 5, 20, 21, 0),
        new Date(2026, 5, 20, 22, 0),
        [existingFast],
      ),
    ).toBe(false)
  })

  it('should return false when the candidate fast starts exactly when an existing fast ends', () => {
    expect(
      doesFastOverlap(
        new Date(2026, 5, 20, 20, 0),
        new Date(2026, 5, 20, 22, 0),
        [existingFast],
      ),
    ).toBe(false)
  })

  it('should return false when the candidate fast ends exactly when an existing fast starts', () => {
    expect(
      doesFastOverlap(
        new Date(2026, 5, 20, 8, 0),
        new Date(2026, 5, 20, 10, 0),
        [existingFast],
      ),
    ).toBe(false)
  })

  it('should return true when the candidate fast overlaps the start of an existing fast', () => {
    expect(
      doesFastOverlap(
        new Date(2026, 5, 20, 8, 0),
        new Date(2026, 5, 20, 12, 0),
        [existingFast],
      ),
    ).toBe(true)
  })

  it('should return true when the candidate fast overlaps the end of an existing fast', () => {
    expect(
      doesFastOverlap(
        new Date(2026, 5, 20, 18, 0),
        new Date(2026, 5, 20, 22, 0),
        [existingFast],
      ),
    ).toBe(true)
  })

  it('should return true when the candidate fast is fully contained within an existing fast', () => {
    expect(
      doesFastOverlap(
        new Date(2026, 5, 20, 12, 0),
        new Date(2026, 5, 20, 18, 0),
        [existingFast],
      ),
    ).toBe(true)
  })

  it('should return true when the candidate fast fully contains an existing fast', () => {
    expect(
      doesFastOverlap(
        new Date(2026, 5, 20, 8, 0),
        new Date(2026, 5, 20, 22, 0),
        [existingFast],
      ),
    ).toBe(true)
  })

  it('should return true when the candidate fast overlaps any existing fast', () => {
    const fasts: Fast[] = [
      {
        id: '1',
        startedAt: new Date(2026, 5, 20, 10, 0).toISOString(),
        endedAt: new Date(2026, 5, 20, 20, 0).toISOString(),
      },
      {
        id: '2',
        startedAt: new Date(2026, 5, 21, 10, 0).toISOString(),
        endedAt: new Date(2026, 5, 21, 20, 0).toISOString(),
      },
    ]

    expect(
      doesFastOverlap(
        new Date(2026, 5, 21, 15, 0),
        new Date(2026, 5, 21, 22, 0),
        fasts,
      ),
    ).toBe(true)
  })
})

describe('getFastValidationErrors', () => {
  it('should return an empty array when the fast is valid', () => {
    expect(
      getFastValidationErrors(
        new Date(2026, 5, 20, 18, 0),
        new Date(2026, 5, 21, 10, 0),
        [],
      ),
    ).toEqual([])
  })

  it('should return an error when the start time is after the end time', () => {
    expect(
      getFastValidationErrors(
        new Date(2026, 5, 21, 10, 0),
        new Date(2026, 5, 20, 18, 0),
        [],
      ),
    ).toContain('The start time must be before the end time.')
  })

  it('should return an error when the start time equals the end time', () => {
    const date = new Date(2026, 5, 20, 18, 0)

    expect(getFastValidationErrors(date, date, [])).toContain(
      'The start time must be before the end time.',
    )
  })

  it('should return an error when the fast ends in the future', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    expect(getFastValidationErrors(new Date(), tomorrow, [])).toContain(
      'The fast cannot end in the future.',
    )
  })

  it('should return an error when the fast overlaps an existing fast', () => {
    const fasts: Fast[] = [
      {
        id: '1',
        startedAt: new Date(2026, 5, 20, 10, 0).toISOString(),
        endedAt: new Date(2026, 5, 20, 20, 0).toISOString(),
      },
    ]

    expect(
      getFastValidationErrors(
        new Date(2026, 5, 20, 12, 0),
        new Date(2026, 5, 20, 18, 0),
        fasts,
      ),
    ).toContain('The fast overlaps an existing fast.')
  })

  it('should return multiple errors when multiple validation rules fail', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const dayAfterTomorrow = new Date()
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

    const errors = getFastValidationErrors(dayAfterTomorrow, tomorrow, [])

    expect(errors).toContain('The start time must be before the end time.')
    expect(errors).toContain('The fast cannot end in the future.')
    expect(errors).toHaveLength(2)
  })
})

describe('filterFastsByCadence', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-10T00:00:00.000Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const fasts: Fast[] = [
    {
      id: 'week',
      startedAt: '2026-01-05T00:00:00.000Z',
      endedAt: '2026-01-05T16:00:00.000Z',
    },
    {
      id: 'month',
      startedAt: '2025-12-20T00:00:00.000Z',
      endedAt: '2025-12-20T16:00:00.000Z',
    },
    {
      id: 'year',
      startedAt: '2025-06-01T00:00:00.000Z',
      endedAt: '2025-06-01T16:00:00.000Z',
    },
    {
      id: 'old',
      startedAt: '2024-01-01T00:00:00.000Z',
      endedAt: '2024-01-01T16:00:00.000Z',
    },
  ]

  it('should return all fasts when cadence is all', () => {
    expect(filterFastsByCadence(fasts, 'all')).toEqual(fasts)
  })

  it('should return only fasts from the last week', () => {
    const result = filterFastsByCadence(fasts, 'week')

    expect(result.map((fast) => fast.id)).toEqual(['week'])
  })

  it('should return only fasts from the last month', () => {
    const result = filterFastsByCadence(fasts, 'month')

    expect(result.map((fast) => fast.id)).toEqual(['week', 'month'])
  })

  it('should return only fasts from the last year', () => {
    const result = filterFastsByCadence(fasts, 'year')

    expect(result.map((fast) => fast.id)).toEqual(['week', 'month', 'year'])
  })

  it('should return an empty array when no fasts match the cadence', () => {
    const result = filterFastsByCadence(
      [
        {
          id: 'old',
          startedAt: '2020-01-01T00:00:00.000Z',
          endedAt: '2020-01-01T16:00:00.000Z',
        },
      ],
      'week',
    )

    expect(result).toEqual([])
  })

  it('should include fasts exactly on the weekly cutoff boundary', () => {
    const result = filterFastsByCadence(
      [
        {
          id: 'boundary',
          startedAt: '2026-01-03T00:00:00.000Z',
          endedAt: '2026-01-03T16:00:00.000Z',
        },
      ],
      'week',
    )

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('boundary')
  })

  it('should include fasts exactly on the monthly cutoff boundary', () => {
    const result = filterFastsByCadence(
      [
        {
          id: 'boundary',
          startedAt: '2025-12-10T00:00:00.000Z',
          endedAt: '2025-12-10T16:00:00.000Z',
        },
      ],
      'month',
    )

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('boundary')
  })

  it('should include fasts exactly on the yearly cutoff boundary', () => {
    const result = filterFastsByCadence(
      [
        {
          id: 'boundary',
          startedAt: '2025-01-10T00:00:00.000Z',
          endedAt: '2025-01-10T16:00:00.000Z',
        },
      ],
      'year',
    )

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('boundary')
  })
})

describe('sortFasts', () => {
  it('sorts fasts by ascending start time', () => {
    const fasts = [
      {
        id: '2',
        startedAt: '2026-01-02T18:00:00Z',
        endedAt: '2026-01-03T10:00:00Z',
      },
      {
        id: '1',
        startedAt: '2026-01-01T18:00:00Z',
        endedAt: '2026-01-02T10:00:00Z',
      },
      {
        id: '3',
        startedAt: '2026-01-03T18:00:00Z',
        endedAt: '2026-01-04T10:00:00Z',
      },
    ]

    expect(sortFasts(fasts).map((f) => f.id)).toEqual(['1', '2', '3'])
  })

  it('does not mutate the input array', () => {
    const fasts = [
      {
        id: '2',
        startedAt: '2026-01-02T18:00:00Z',
        endedAt: '2026-01-03T10:00:00Z',
      },
      {
        id: '1',
        startedAt: '2026-01-01T18:00:00Z',
        endedAt: '2026-01-02T10:00:00Z',
      },
    ]

    const original = [...fasts]

    sortFasts(fasts)

    expect(fasts).toEqual(original)
  })
})

describe('getPreferredFastSchedule', () => {
  it('returns the preferred schedule when it ends on the same day', () => {
    expect(
      getPreferredFastSchedule(
        {
          hour: 8,
          minute: 30,
        },
        8,
      ),
    ).toEqual({
      startsAt: {
        hour: 8,
        minute: 30,
      },
      endsAt: {
        hour: 16,
        minute: 30,
      },
      endsNextDay: false,
    })
  })

  it('returns the preferred schedule when it wraps to the next day', () => {
    expect(
      getPreferredFastSchedule(
        {
          hour: 18,
          minute: 0,
        },
        16,
      ),
    ).toEqual({
      startsAt: {
        hour: 18,
        minute: 0,
      },
      endsAt: {
        hour: 10,
        minute: 0,
      },
      endsNextDay: true,
    })
  })

  it('preserves the preferred start minute', () => {
    expect(
      getPreferredFastSchedule(
        {
          hour: 19,
          minute: 45,
        },
        16,
      ).endsAt,
    ).toEqual({
      hour: 11,
      minute: 45,
    })
  })

  it('handles midnight correctly', () => {
    expect(
      getPreferredFastSchedule(
        {
          hour: 0,
          minute: 15,
        },
        16,
      ).endsAt,
    ).toEqual({
      hour: 16,
      minute: 15,
    })
  })
})

describe('formatPreferredTime', () => {
  it('formats a preferred time', () => {
    const formatted = formatPreferredTime({
      hour: 18,
      minute: 5,
    })

    expect(typeof formatted).toBe('string')
    expect(formatted).toContain('6')
    expect(formatted).toContain('05')
  })

  it('formats midnight', () => {
    expect(
      formatPreferredTime({
        hour: 0,
        minute: 0,
      }),
    ).toMatch(/12|00/)
  })

  it('formats noon', () => {
    expect(
      formatPreferredTime({
        hour: 12,
        minute: 0,
      }),
    ).toMatch(/12/)
  })
})
