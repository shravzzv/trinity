import { sortWeightEntries } from '@/lib/weight'
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
