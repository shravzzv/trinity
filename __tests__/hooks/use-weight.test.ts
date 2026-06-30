import { TARGET_WEIGHT_KG_STORAGE_KEY } from '@/constants/storage-keys'
import { useWeight } from '@/hooks/use-weight'
import {
  addWeightEntry,
  deleteWeightEntry,
  getWeightEntries,
  updateWeightEntry,
} from '@/lib/indexed-db'
import { act, renderHook, waitFor } from '@testing-library/react'

jest.mock('uuid')

jest.mock('@/lib/indexed-db', () => ({
  getWeightEntries: jest.fn(),
  addWeightEntry: jest.fn(),
  updateWeightEntry: jest.fn(),
  deleteWeightEntry: jest.fn(),
}))

const getWeightEntriesMock = jest.mocked(getWeightEntries)
const addWeightEntryMock = jest.mocked(addWeightEntry)
const updateWeightEntryMock = jest.mocked(updateWeightEntry)
const deleteWeightEntryMock = jest.mocked(deleteWeightEntry)

describe('useWeight', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()

    getWeightEntriesMock.mockResolvedValue([])

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('should initialize with the default state', async () => {
    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.entries).toEqual([])
    expect(result.current.targetWeightKg).toBeNull()
  })

  it('should hydrate target weight from local storage', async () => {
    localStorage.setItem(TARGET_WEIGHT_KG_STORAGE_KEY, JSON.stringify(58))

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.targetWeightKg).toBe(58)
  })

  it('should hydrate weight entries from indexeddb', async () => {
    getWeightEntriesMock.mockResolvedValue([
      {
        id: '1',
        recordedAt: '2026-01-01T10:00:00.000Z',
        weightKg: 61.2,
      },
    ])

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.entries).toEqual([
      {
        id: '1',
        recordedAt: '2026-01-01T10:00:00.000Z',
        weightKg: 61.2,
      },
    ])
  })

  it('should fall back to defaults when target weight json is invalid', async () => {
    localStorage.setItem(TARGET_WEIGHT_KG_STORAGE_KEY, '{broken json')

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.targetWeightKg).toBeNull()
  })

  it('should remove corrupted target weight from local storage', async () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    localStorage.setItem(TARGET_WEIGHT_KG_STORAGE_KEY, '{broken json')

    renderHook(() => useWeight())

    await waitFor(() => {
      expect(removeItemSpy).toHaveBeenCalledWith(TARGET_WEIGHT_KG_STORAGE_KEY)
    })
  })

  it('should fall back to default state when target weight is invalid', async () => {
    localStorage.setItem(TARGET_WEIGHT_KG_STORAGE_KEY, JSON.stringify('banana'))

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.targetWeightKg).toBeNull()
  })

  it('should update the target weight', async () => {
    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.updateTargetWeight(58)
    })

    expect(result.current.targetWeightKg).toBe(58)
  })

  it('should persist target weight changes to local storage', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.updateTargetWeight(58)
    })

    expect(setItemSpy).toHaveBeenLastCalledWith(
      TARGET_WEIGHT_KG_STORAGE_KEY,
      '58',
    )
  })

  it('should add a weight entry', async () => {
    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.addWeightEntry(
        61.5,
        new Date('2026-01-01T10:00:00.000Z'),
      )
    })

    expect(result.current.entries).toEqual([
      {
        id: 'test-uuid',
        recordedAt: '2026-01-01T10:00:00.000Z',
        weightKg: 61.5,
      },
    ])

    expect(addWeightEntryMock).toHaveBeenCalledWith({
      id: 'test-uuid',
      recordedAt: '2026-01-01T10:00:00.000Z',
      weightKg: 61.5,
    })
  })

  it('should keep entries sorted when adding', async () => {
    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.addWeightEntry(
        60,
        new Date('2026-01-03T10:00:00.000Z'),
      )
    })

    await act(async () => {
      await result.current.addWeightEntry(
        62,
        new Date('2026-01-01T10:00:00.000Z'),
      )
    })

    await act(async () => {
      await result.current.addWeightEntry(
        61,
        new Date('2026-01-02T10:00:00.000Z'),
      )
    })

    expect(result.current.entries.map((e) => e.weightKg)).toEqual([62, 61, 60])
  })

  it('should preserve the id when replacing a weight entry on the same day', async () => {
    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.addWeightEntry(
        61,
        new Date('2026-01-01T10:00:00.000Z'),
      )
    })

    updateWeightEntryMock.mockResolvedValue(undefined)

    await act(async () => {
      await result.current.addWeightEntry(
        60.5,
        new Date('2026-01-01T18:00:00.000Z'),
      )
    })

    expect(result.current.entries).toHaveLength(1)

    expect(result.current.entries[0]).toEqual({
      id: 'test-uuid',
      recordedAt: '2026-01-01T18:00:00.000Z',
      weightKg: 60.5,
    })

    expect(updateWeightEntryMock).toHaveBeenCalled()
  })

  it('should delete a weight entry', async () => {
    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.addWeightEntry(
        61,
        new Date('2026-01-01T10:00:00.000Z'),
      )
    })

    await act(async () => {
      await result.current.deleteWeightEntry('test-uuid')
    })

    expect(result.current.entries).toEqual([])

    expect(deleteWeightEntryMock).toHaveBeenCalledWith('test-uuid')
  })

  it('should update a weight entry', async () => {
    getWeightEntriesMock.mockResolvedValue([
      {
        id: 'test-uuid',
        recordedAt: '2026-01-01T10:00:00.000Z',
        weightKg: 61,
      },
    ])

    const { result: hydrated } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(hydrated.current.isLoading).toBe(false)
    })

    await act(async () => {
      await hydrated.current.updateWeightEntry({
        id: 'test-uuid',
        recordedAt: '2026-01-01T10:00:00.000Z',
        weightKg: 59.8,
      })
    })

    expect(hydrated.current.entries[0].weightKg).toBe(59.8)

    expect(updateWeightEntryMock).toHaveBeenCalled()
  })

  it('should keep entries sorted when updating', async () => {
    getWeightEntriesMock.mockResolvedValue([
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
    ])

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.updateWeightEntry({
        id: '2',
        weightKg: 61,
        recordedAt: '2026-01-01T10:00:00.000Z',
      })
    })

    expect(result.current.entries.map((e) => e.id)).toEqual(['2', '1'])
  })

  it('should rollback optimistic add when indexeddb save fails', async () => {
    addWeightEntryMock.mockRejectedValue(new Error('db failed'))

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await expect(
      result.current.addWeightEntry(61, new Date('2026-01-01T10:00:00.000Z')),
    ).rejects.toThrow('Failed to save the weight')

    expect(result.current.entries).toEqual([])
  })

  it('should rollback optimistic delete when indexeddb delete fails', async () => {
    getWeightEntriesMock.mockResolvedValue([
      {
        id: '1',
        weightKg: 61,
        recordedAt: '2026-01-01T10:00:00.000Z',
      },
    ])

    deleteWeightEntryMock.mockRejectedValue(new Error('db failed'))

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await expect(result.current.deleteWeightEntry('1')).rejects.toThrow(
      'Failed to delete the weight',
    )

    expect(result.current.entries).toHaveLength(1)
  })

  it('should rollback optimistic update when indexeddb update fails', async () => {
    getWeightEntriesMock.mockResolvedValue([
      {
        id: '1',
        weightKg: 61,
        recordedAt: '2026-01-01T10:00:00.000Z',
      },
    ])

    updateWeightEntryMock.mockRejectedValue(new Error('db failed'))

    const { result } = renderHook(() => useWeight())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await expect(
      result.current.updateWeightEntry({
        id: '1',
        weightKg: 59,
        recordedAt: '2026-01-01T10:00:00.000Z',
      }),
    ).rejects.toThrow('Failed to update the weight')

    expect(result.current.entries[0].weightKg).toBe(61)
  })
})
