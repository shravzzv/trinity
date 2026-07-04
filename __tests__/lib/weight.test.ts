import {
  formatWeight,
  sortWeightEntries,
  getTargetProgress,
  getWeightStatistics,
  filterWeightEntriesByCadence,
} from '@/lib/weight'
import type { WeightEntry } from '@/types/weight'

describe('sortWeightEntries', () => {
  it('should sort entries in ascending chronological order', () => {
    const entries: WeightEntry[] = [
      {
        id: 'late',
        weightKg: 60,
        recordedAt: '2026-01-03T10:00:00.000Z',
      },
      {
        id: 'early',
        weightKg: 62,
        recordedAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: 'middle',
        weightKg: 61,
        recordedAt: '2026-01-02T10:00:00.000Z',
      },
    ]

    const sorted = sortWeightEntries(entries)

    expect(sorted.map((entry) => entry.id)).toEqual(['early', 'middle', 'late'])
  })

  it('should not mutate the input array', () => {
    const entries: WeightEntry[] = [
      {
        id: 'late',
        weightKg: 60,
        recordedAt: '2026-01-03T10:00:00.000Z',
      },
      {
        id: 'early',
        weightKg: 62,
        recordedAt: '2026-01-01T10:00:00.000Z',
      },
    ]

    const original = [...entries]

    sortWeightEntries(entries)

    expect(entries).toEqual(original)
  })

  it('should return an already sorted array unchanged', () => {
    const entries: WeightEntry[] = [
      {
        id: '1',
        weightKg: 62,
        recordedAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: '2',
        weightKg: 61,
        recordedAt: '2026-01-02T10:00:00.000Z',
      },
      {
        id: '3',
        weightKg: 60,
        recordedAt: '2026-01-03T10:00:00.000Z',
      },
    ]

    expect(sortWeightEntries(entries)).toEqual(entries)
  })

  it('should return an empty array when given no entries', () => {
    expect(sortWeightEntries([])).toEqual([])
  })

  it('should return the single entry unchanged', () => {
    const entries: WeightEntry[] = [
      {
        id: '1',
        weightKg: 61.5,
        recordedAt: '2026-01-01T10:00:00.000Z',
      },
    ]

    expect(sortWeightEntries(entries)).toEqual(entries)
  })

  it('should preserve all entries after sorting', () => {
    const entries: WeightEntry[] = [
      {
        id: '3',
        weightKg: 60,
        recordedAt: '2026-01-03T10:00:00.000Z',
      },
      {
        id: '1',
        weightKg: 62,
        recordedAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: '2',
        weightKg: 61,
        recordedAt: '2026-01-02T10:00:00.000Z',
      },
    ]

    const sorted = sortWeightEntries(entries)

    expect(sorted).toHaveLength(entries.length)
    expect(sorted).toEqual(expect.arrayContaining(entries))
  })

  it('should preserve entries with identical recording timestamps', () => {
    const entries: WeightEntry[] = [
      {
        id: '1',
        weightKg: 61,
        recordedAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: '2',
        weightKg: 62,
        recordedAt: '2026-01-01T10:00:00.000Z',
      },
    ]

    const sorted = sortWeightEntries(entries)

    expect(sorted).toHaveLength(2)
    expect(sorted).toEqual(expect.arrayContaining(entries))
  })
})

describe('filterWeightEntriesByCadence', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-15T12:00:00Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  const entries: WeightEntry[] = [
    {
      id: '1',
      weightKg: 80,
      recordedAt: new Date('2024-12-01T12:00:00Z').toISOString(),
    },
    {
      id: '2',
      weightKg: 79,
      recordedAt: new Date('2025-12-20T12:00:00Z').toISOString(),
    },
    {
      id: '3',
      weightKg: 78,
      recordedAt: new Date('2026-01-10T12:00:00Z').toISOString(),
    },
    {
      id: '4',
      weightKg: 77,
      recordedAt: new Date('2026-01-14T12:00:00Z').toISOString(),
    },
  ]

  it('returns the original array for all cadence', () => {
    expect(filterWeightEntriesByCadence(entries, 'all')).toBe(entries)
  })

  it('filters entries within the last week', () => {
    expect(
      filterWeightEntriesByCadence(entries, 'week').map((e) => e.id),
    ).toEqual(['3', '4'])
  })

  it('filters entries within the last month', () => {
    expect(
      filterWeightEntriesByCadence(entries, 'month').map((e) => e.id),
    ).toEqual(['2', '3', '4'])
  })

  it('filters entries within the last year', () => {
    expect(
      filterWeightEntriesByCadence(entries, 'year').map((e) => e.id),
    ).toEqual(['2', '3', '4'])
  })

  it('returns an empty array when nothing matches', () => {
    expect(
      filterWeightEntriesByCadence(
        [
          {
            id: '1',
            weightKg: 80,
            recordedAt: new Date('2020-01-01').toISOString(),
          },
        ],
        'week',
      ),
    ).toEqual([])
  })

  it('preserves entry order', () => {
    expect(
      filterWeightEntriesByCadence(entries, 'month').map((e) => e.id),
    ).toEqual(['2', '3', '4'])
  })
})

describe('getWeightStatistics', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-15T12:00:00Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('returns null statistics for an empty collection', () => {
    expect(getWeightStatistics([], 'all')).toEqual({
      filteredEntries: [],
      currentWeight: null,
      lowestWeight: null,
      highestWeight: null,
      weightChange: null,
    })
  })

  it('returns statistics for a single entry', () => {
    const entries: WeightEntry[] = [
      {
        id: '1',
        weightKg: 75,
        recordedAt: new Date('2026-01-10').toISOString(),
      },
    ]

    expect(getWeightStatistics(entries, 'all')).toEqual({
      filteredEntries: entries,
      currentWeight: 75,
      lowestWeight: 75,
      highestWeight: 75,
      weightChange: null,
    })
  })

  it('returns statistics for multiple entries', () => {
    const entries: WeightEntry[] = [
      {
        id: '1',
        weightKg: 80,
        recordedAt: new Date('2026-01-01').toISOString(),
      },
      {
        id: '2',
        weightKg: 78,
        recordedAt: new Date('2026-01-05').toISOString(),
      },
      {
        id: '3',
        weightKg: 79,
        recordedAt: new Date('2026-01-10').toISOString(),
      },
    ]

    expect(getWeightStatistics(entries, 'all')).toEqual({
      filteredEntries: entries,
      currentWeight: 79,
      lowestWeight: 78,
      highestWeight: 80,
      weightChange: -1,
    })
  })

  it('uses the requested cadence', () => {
    const entries: WeightEntry[] = [
      {
        id: '1',
        weightKg: 90,
        recordedAt: new Date('2024-01-01').toISOString(),
      },
      {
        id: '2',
        weightKg: 80,
        recordedAt: new Date('2026-01-12').toISOString(),
      },
    ]

    expect(getWeightStatistics(entries, 'week')).toEqual({
      filteredEntries: [entries[1]],
      currentWeight: 80,
      lowestWeight: 80,
      highestWeight: 80,
      weightChange: null,
    })
  })
})

describe('getTargetProgress', () => {
  it('returns null when current weight is unavailable', () => {
    expect(getTargetProgress(null, 70)).toBeNull()
  })

  it('returns null when target weight is unavailable', () => {
    expect(getTargetProgress(75, null)).toBeNull()
  })

  it('returns remaining weight when target has not been reached', () => {
    expect(getTargetProgress(75, 70)).toEqual({
      reached: false,
      remainingWeight: 5,
    })
  })

  it('returns zero remaining weight when target is reached exactly', () => {
    expect(getTargetProgress(70, 70)).toEqual({
      reached: true,
      remainingWeight: 0,
    })
  })

  it('returns zero remaining weight when target has been exceeded', () => {
    expect(getTargetProgress(68, 70)).toEqual({
      reached: true,
      remainingWeight: 0,
    })
  })
})

describe('formatWeight', () => {
  it('formats a weight', () => {
    expect(formatWeight(72.34)).toBe('72.3 kg')
  })

  it('formats whole numbers with one decimal place', () => {
    expect(formatWeight(70)).toBe('70.0 kg')
  })

  it('returns an em dash for null', () => {
    expect(formatWeight(null)).toBe('—')
  })
})
