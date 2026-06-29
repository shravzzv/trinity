import { WEIGHT_STATE_STORAGE_KEY } from '@/constants/storage-keys'
import { useWeight } from '@/hooks/use-weight'
import { renderHook, waitFor, act } from '@testing-library/react'

jest.mock('uuid')

describe('useWeight', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('should initialize with the default state', () => {
    const { result } = renderHook(() => useWeight())

    expect(result.current.entries).toEqual([])
    expect(result.current.targetWeightKg).toBeNull()
  })

  it('should hydrate from local storage', async () => {
    localStorage.setItem(
      WEIGHT_STATE_STORAGE_KEY,
      JSON.stringify({
        targetWeightKg: 58,
        entries: [
          {
            id: '1',
            recordedAt: '2026-01-01T10:00:00.000Z',
            weightKg: 61.2,
          },
        ],
      }),
    )

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    expect(result.current.targetWeightKg).toBe(58)
    expect(result.current.entries).toEqual([
      {
        id: '1',
        recordedAt: '2026-01-01T10:00:00.000Z',
        weightKg: 61.2,
      },
    ])
  })

  it('should hydrate entries in ascending chronological order', async () => {
    localStorage.setItem(
      WEIGHT_STATE_STORAGE_KEY,
      JSON.stringify({
        targetWeightKg: null,
        entries: [
          {
            id: 'late',
            recordedAt: '2026-01-03T10:00:00.000Z',
            weightKg: 60,
          },
          {
            id: 'early',
            recordedAt: '2026-01-01T10:00:00.000Z',
            weightKg: 62,
          },
          {
            id: 'middle',
            recordedAt: '2026-01-02T10:00:00.000Z',
            weightKg: 61,
          },
        ],
      }),
    )

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    expect(result.current.entries.map((e) => e.id)).toEqual([
      'early',
      'middle',
      'late',
    ])
  })

  it('should fall back to the default state when local storage contains invalid JSON', async () => {
    localStorage.setItem(WEIGHT_STATE_STORAGE_KEY, '{broken json')

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    expect(result.current.entries).toEqual([])
    expect(result.current.targetWeightKg).toBeNull()
  })

  it('should remove corrupted local storage', async () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    localStorage.setItem(WEIGHT_STATE_STORAGE_KEY, '{broken json')

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    expect(removeItemSpy).toHaveBeenCalledWith(WEIGHT_STATE_STORAGE_KEY)
  })

  it('should fall back to the default state when entries are invalid', async () => {
    localStorage.setItem(
      WEIGHT_STATE_STORAGE_KEY,
      JSON.stringify({
        targetWeightKg: 58,
        entries: 'banana',
      }),
    )

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    expect(result.current.entries).toEqual([])
    expect(result.current.targetWeightKg).toBeNull()
  })

  it('should fall back to the default state when target weight is invalid', async () => {
    localStorage.setItem(
      WEIGHT_STATE_STORAGE_KEY,
      JSON.stringify({
        targetWeightKg: 'banana',
        entries: [],
      }),
    )

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    expect(result.current.entries).toEqual([])
    expect(result.current.targetWeightKg).toBeNull()
  })

  it('should update the target weight', () => {
    const { result } = renderHook(() => useWeight())

    act(() => {
      result.current.updateTargetWeight(58)
    })

    expect(result.current.targetWeightKg).toBe(58)
  })

  it('should persist target weight changes to local storage', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    act(() => {
      result.current.updateTargetWeight(58)
    })

    expect(setItemSpy).toHaveBeenLastCalledWith(
      WEIGHT_STATE_STORAGE_KEY,
      expect.stringContaining('"targetWeightKg":58'),
    )
  })

  it('should add a weight entry', () => {
    const { result } = renderHook(() => useWeight())

    act(() => {
      result.current.addWeight(61.5, new Date('2026-01-01T10:00:00.000Z'))
    })

    expect(result.current.entries).toEqual([
      {
        id: 'test-uuid',
        recordedAt: '2026-01-01T10:00:00.000Z',
        weightKg: 61.5,
      },
    ])
  })

  it('should keep entries sorted by recording date when adding', () => {
    const { result } = renderHook(() => useWeight())

    act(() => {
      result.current.addWeight(60, new Date('2026-01-03T10:00:00.000Z'))
      result.current.addWeight(62, new Date('2026-01-01T10:00:00.000Z'))
      result.current.addWeight(61, new Date('2026-01-02T10:00:00.000Z'))
    })

    expect(result.current.entries.map((e) => e.weightKg)).toEqual([62, 61, 60])
  })

  it('should preserve the id when replacing a weight entry recorded on the same day', () => {
    const { result } = renderHook(() => useWeight())

    act(() => {
      result.current.addWeight(61, new Date('2026-01-01T10:00:00.000Z'))
    })

    expect(result.current.entries).toHaveLength(1)
    expect(result.current.entries[0].id).toBe('test-uuid')

    act(() => {
      result.current.addWeight(60.5, new Date('2026-01-01T18:00:00.000Z'))
    })

    expect(result.current.entries).toHaveLength(1)
    expect(result.current.entries[0]).toEqual({
      id: 'test-uuid',
      recordedAt: '2026-01-01T18:00:00.000Z',
      weightKg: 60.5,
    })
  })

  it('should delete a weight entry', () => {
    const { result } = renderHook(() => useWeight())

    act(() => {
      result.current.addWeight(61, new Date('2026-01-01T10:00:00.000Z'))
    })

    act(() => {
      result.current.deleteWeight('test-uuid')
    })

    expect(result.current.entries).toEqual([])
  })

  it('should update a weight entry', () => {
    const { result } = renderHook(() => useWeight())

    act(() => {
      result.current.addWeight(61, new Date('2026-01-01T10:00:00.000Z'))
    })

    act(() => {
      result.current.updateWeight({
        id: 'test-uuid',
        recordedAt: '2026-01-01T10:00:00.000Z',
        weightKg: 59.8,
      })
    })

    expect(result.current.entries[0].weightKg).toBe(59.8)
  })

  it('should keep entries sorted when updating', async () => {
    localStorage.setItem(
      WEIGHT_STATE_STORAGE_KEY,
      JSON.stringify({
        targetWeightKg: null,
        entries: [
          {
            id: '1',
            weightKg: 60,
            recordedAt: '2026-01-02T10:00:00.000Z',
          },
          {
            id: '2',
            weightKg: 61,
            recordedAt: '2026-01-03T10:00:00.000Z',
          },
        ],
      }),
    )

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    act(() => {
      result.current.updateWeight({
        id: '2',
        weightKg: 61,
        recordedAt: '2026-01-01T10:00:00.000Z',
      })
    })

    expect(result.current.entries.map((entry) => entry.id)).toEqual(['2', '1'])
    expect(result.current.entries.map((entry) => entry.recordedAt)).toEqual([
      '2026-01-01T10:00:00.000Z',
      '2026-01-02T10:00:00.000Z',
    ])
  })

  it('should persist weight entries to local storage', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    act(() => {
      result.current.addWeight(61.4, new Date('2026-01-01T10:00:00.000Z'))
    })

    expect(setItemSpy).toHaveBeenLastCalledWith(
      WEIGHT_STATE_STORAGE_KEY,
      expect.stringContaining('"weightKg":61.4'),
    )
  })
})
