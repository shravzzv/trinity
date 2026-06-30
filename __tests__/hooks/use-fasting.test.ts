import { useFasting } from '@/hooks/use-fasting'
import { renderHook, waitFor, act } from '@testing-library/react'
import {
  FASTING_PLAN_ID_STORAGE_KEY,
  FASTING_SESSION_STORAGE_KEY,
} from '@/constants/storage-keys'

jest.mock('uuid')
jest.mock('@/lib/indexed-db', () => ({
  getFasts: jest.fn().mockResolvedValue([]),
  addFast: jest.fn().mockResolvedValue(undefined),
  updateFast: jest.fn().mockResolvedValue(undefined),
  deleteFast: jest.fn().mockResolvedValue(undefined),
}))

describe('useFasting', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    jest.useRealTimers()
  })

  it('starts in the default state', async () => {
    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.planId).toBeNull()
    expect(result.current.session).toBeNull()
    expect(result.current.fasts).toEqual([])
  })

  it('hydrates the persisted plan id', async () => {
    localStorage.setItem(FASTING_PLAN_ID_STORAGE_KEY, JSON.stringify('20:4'))

    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.planId).toBe('20:4')
  })

  it('hydrates the persisted session', async () => {
    localStorage.setItem(
      FASTING_SESSION_STORAGE_KEY,
      JSON.stringify({
        status: 'fasting',
        startedAt: '2026-01-01T00:00:00.000Z',
      }),
    )

    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.session).toEqual({
      status: 'fasting',
      startedAt: '2026-01-01T00:00:00.000Z',
    })
  })

  it('removes corrupted plan id storage', async () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    localStorage.setItem(FASTING_PLAN_ID_STORAGE_KEY, JSON.stringify('banana'))

    renderHook(() => useFasting())

    await waitFor(() => {
      expect(removeItemSpy).toHaveBeenCalledWith(FASTING_PLAN_ID_STORAGE_KEY)
    })
  })

  it('removes corrupted session storage', async () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    localStorage.setItem(
      FASTING_SESSION_STORAGE_KEY,
      JSON.stringify({
        status: 'banana',
        startedAt: '2026-01-01T00:00:00.000Z',
      }),
    )

    renderHook(() => useFasting())

    await waitFor(() => {
      expect(removeItemSpy).toHaveBeenCalledWith(FASTING_SESSION_STORAGE_KEY)
    })
  })

  it('updates the selected plan', async () => {
    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.updatePlanId('20:4')
    })

    expect(result.current.planId).toBe('20:4')
  })

  it('persists plan changes', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    setItemSpy.mockClear()

    act(() => {
      result.current.updatePlanId('20:4')
    })

    expect(setItemSpy).toHaveBeenCalledWith(
      FASTING_PLAN_ID_STORAGE_KEY,
      JSON.stringify('20:4'),
    )
  })

  it('starts a fasting session', async () => {
    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.startFasting()
    })

    expect(result.current.session?.status).toBe('fasting')
    expect(result.current.session?.startedAt).toBeDefined()
  })

  it('starts an eating session', async () => {
    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.endFasting()
    })

    expect(result.current.session?.status).toBe('eating')
    expect(result.current.session?.startedAt).toBeDefined()
  })

  it('persists session changes', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    setItemSpy.mockClear()

    act(() => {
      result.current.startFasting()
    })

    expect(setItemSpy).toHaveBeenCalledWith(
      FASTING_SESSION_STORAGE_KEY,
      expect.stringContaining('"status":"fasting"'),
    )
  })

  it('preserves the selected plan when starting fasting', async () => {
    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.updatePlanId('20:4')
      result.current.startFasting()
    })

    expect(result.current.planId).toBe('20:4')
    expect(result.current.session?.status).toBe('fasting')
  })

  it('preserves the session when updating the plan', async () => {
    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.startFasting()
    })

    const originalSession = result.current.session

    act(() => {
      result.current.updatePlanId('20:4')
    })

    expect(result.current.planId).toBe('20:4')
    expect(result.current.session).toEqual(originalSession)
  })

  it('creates a completed fast when transitioning from fasting to eating', async () => {
    jest.useFakeTimers()

    jest.setSystemTime(new Date('2026-01-01T10:00:00.000Z'))

    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.startFasting()
    })

    jest.setSystemTime(new Date('2026-01-01T18:00:00.000Z'))

    await act(async () => {
      await result.current.endFasting()
    })

    expect(result.current.fasts).toHaveLength(1)
    expect(result.current.session?.status).toBe('eating')
  })

  it('does not create a completed fast when transitioning from eating to fasting', async () => {
    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.endFasting()
    })

    act(() => {
      result.current.startFasting()
    })

    expect(result.current.fasts).toEqual([])
  })

  it('adds a fast', () => {
    const { result } = renderHook(() => useFasting())

    act(() => {
      result.current.addFast({
        id: 'fast-1',
        startedAt: '2026-01-01T10:00:00.000Z',
        endedAt: '2026-01-01T18:00:00.000Z',
      })
    })

    expect(result.current.fasts).toHaveLength(1)
  })

  it('keeps fasts sorted when adding', () => {
    const { result } = renderHook(() => useFasting())

    act(() => {
      result.current.addFast({
        id: 'late',
        startedAt: '2026-01-03T10:00:00.000Z',
        endedAt: '2026-01-03T18:00:00.000Z',
      })

      result.current.addFast({
        id: 'early',
        startedAt: '2026-01-01T10:00:00.000Z',
        endedAt: '2026-01-01T18:00:00.000Z',
      })

      result.current.addFast({
        id: 'middle',
        startedAt: '2026-01-02T10:00:00.000Z',
        endedAt: '2026-01-02T18:00:00.000Z',
      })
    })

    expect(result.current.fasts.map((f) => f.id)).toEqual([
      'early',
      'middle',
      'late',
    ])
  })

  it('deletes a fast', () => {
    const { result } = renderHook(() => useFasting())

    act(() => {
      result.current.addFast({
        id: 'fast-1',
        startedAt: '2026-01-01T10:00:00.000Z',
        endedAt: '2026-01-01T18:00:00.000Z',
      })
    })

    act(() => {
      result.current.deleteFast('fast-1')
    })

    expect(result.current.fasts).toEqual([])
  })

  it('updates a fast', () => {
    const { result } = renderHook(() => useFasting())

    act(() => {
      result.current.addFast({
        id: 'fast-1',
        startedAt: '2026-01-01T10:00:00.000Z',
        endedAt: '2026-01-01T18:00:00.000Z',
      })
    })

    act(() => {
      result.current.updateFast({
        id: 'fast-1',
        startedAt: '2026-01-01T12:00:00.000Z',
        endedAt: '2026-01-01T20:00:00.000Z',
      })
    })

    expect(result.current.fasts[0]).toEqual({
      id: 'fast-1',
      startedAt: '2026-01-01T12:00:00.000Z',
      endedAt: '2026-01-01T20:00:00.000Z',
    })
  })

  it('keeps fasts sorted after updating', () => {
    const { result } = renderHook(() => useFasting())

    act(() => {
      result.current.addFast({
        id: 'early',
        startedAt: '2026-01-01T10:00:00.000Z',
        endedAt: '2026-01-01T18:00:00.000Z',
      })

      result.current.addFast({
        id: 'late',
        startedAt: '2026-01-03T10:00:00.000Z',
        endedAt: '2026-01-03T18:00:00.000Z',
      })
    })

    act(() => {
      result.current.updateFast({
        id: 'late',
        startedAt: '2025-12-31T10:00:00.000Z',
        endedAt: '2025-12-31T18:00:00.000Z',
      })
    })

    expect(result.current.fasts.map((f) => f.id)).toEqual(['late', 'early'])
  })
})
