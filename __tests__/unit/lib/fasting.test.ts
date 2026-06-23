import {
  getFastDurationHours,
  doesFastOverlap,
  getFastValidationErrors,
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
