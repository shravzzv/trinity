import { useFasting } from '@/hooks/use-fasting'
import { renderHook, waitFor, act } from '@testing-library/react'
import { FASTING_STATE_STORAGE_KEY } from '@/constants/storage-keys'

jest.mock('uuid')

describe('useFasting', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('should return the default state before hydration', () => {
    const { result } = renderHook(() => useFasting())

    expect(result.current.planId).toBe('16:8')
    expect(result.current.session).toBeNull()
  })

  it('should hydrate from local storage', async () => {
    localStorage.setItem(
      FASTING_STATE_STORAGE_KEY,
      JSON.stringify({
        planId: '20:4',
        session: {
          status: 'fasting',
          startedAt: '2026-01-01T00:00:00.000Z',
        },
      }),
    )

    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    expect(result.current.planId).toBe('20:4')
    expect(result.current.session?.status).toBe('fasting')
  })

  it('should fall back to default state when local storage contains invalid JSON', async () => {
    localStorage.setItem(FASTING_STATE_STORAGE_KEY, '{broken json')

    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    expect(result.current.planId).toBe('16:8')
    expect(result.current.session).toBeNull()
  })

  it('should remove corrupted local storage', async () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    localStorage.setItem(FASTING_STATE_STORAGE_KEY, '{broken json')

    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    expect(removeItemSpy).toHaveBeenCalledWith(FASTING_STATE_STORAGE_KEY)
  })

  it('should fall back to default state when session is invalid', async () => {
    localStorage.setItem(
      FASTING_STATE_STORAGE_KEY,
      JSON.stringify({
        planId: '16:8',
        session: {
          status: 'banana',
          startedAt: '2026-01-01T00:00:00.000Z',
        },
      }),
    )

    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    expect(result.current.planId).toBe('16:8')
    expect(result.current.session).toBeNull()
  })

  it('should update the selected plan', () => {
    const { result } = renderHook(() => useFasting())

    act(() => {
      result.current.updatePlanId('20:4')
    })

    expect(result.current.planId).toBe('20:4')
  })

  it('should persist plan changes to local storage', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    act(() => {
      result.current.updatePlanId('20:4')
    })

    expect(setItemSpy).toHaveBeenLastCalledWith(
      FASTING_STATE_STORAGE_KEY,
      expect.stringContaining('"planId":"20:4"'),
    )
  })

  it('should start a fasting session', () => {
    const { result } = renderHook(() => useFasting())

    act(() => {
      result.current.startFasting()
    })

    expect(result.current.session?.status).toBe('fasting')
    expect(result.current.session?.startedAt).toBeDefined()
  })

  it('should start an eating session', () => {
    const { result } = renderHook(() => useFasting())

    act(() => {
      result.current.endFasting()
    })

    expect(result.current.session?.status).toBe('eating')
    expect(result.current.session?.startedAt).toBeDefined()
  })

  it('should preserve the selected plan when starting a session', () => {
    const { result } = renderHook(() => useFasting())

    act(() => {
      result.current.updatePlanId('20:4')
    })

    act(() => {
      result.current.startFasting()
    })

    expect(result.current.planId).toBe('20:4')
    expect(result.current.session?.status).toBe('fasting')
  })

  it('should persist fasting sessions', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    act(() => {
      result.current.startFasting()
    })

    expect(setItemSpy).toHaveBeenCalledWith(
      FASTING_STATE_STORAGE_KEY,
      expect.stringContaining('"status":"fasting"'),
    )
  })

  it('should preserve the current session when updating the plan', async () => {
    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
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

  it('should create a completed fast when transitioning from fasting to eating', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T10:00:00.000Z'))

    const { result } = renderHook(() => useFasting())

    act(() => {
      result.current.startFasting()
    })

    jest.setSystemTime(new Date('2026-01-01T18:00:00.000Z'))

    act(() => {
      result.current.endFasting()
    })

    expect(result.current.fasts).toHaveLength(1)

    expect(result.current.fasts[0]).toEqual({
      id: 'test-uuid',
      startedAt: '2026-01-01T10:00:00.000Z',
      endedAt: '2026-01-01T18:00:00.000Z',
    })

    expect(result.current.session?.status).toBe('eating')

    jest.useRealTimers()
  })

  it('should add a fast to the fasting history', () => {
    const { result } = renderHook(() => useFasting())

    const fast = {
      id: 'fast-1',
      startedAt: '2026-01-01T10:00:00.000Z',
      endedAt: '2026-01-01T18:00:00.000Z',
    }

    act(() => {
      result.current.addFast(fast)
    })

    expect(result.current.fasts).toEqual([fast])
  })

  it('should keep fasts sorted by start date', () => {
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

    expect(result.current.fasts.map((fast) => fast.id)).toEqual([
      'early',
      'middle',
      'late',
    ])
  })

  it('should delete a fast from the fasting history', () => {
    const { result } = renderHook(() => useFasting())

    act(() => {
      result.current.addFast({
        id: 'fast-1',
        startedAt: '2026-01-01T10:00:00.000Z',
        endedAt: '2026-01-01T18:00:00.000Z',
      })

      result.current.addFast({
        id: 'fast-2',
        startedAt: '2026-01-02T10:00:00.000Z',
        endedAt: '2026-01-02T18:00:00.000Z',
      })
    })

    act(() => {
      result.current.deleteFast('fast-1')
    })

    expect(result.current.fasts).toEqual([
      {
        id: 'fast-2',
        startedAt: '2026-01-02T10:00:00.000Z',
        endedAt: '2026-01-02T18:00:00.000Z',
      },
    ])
  })

  it('should preserve other fasts when deleting a fast', () => {
    const { result } = renderHook(() => useFasting())

    act(() => {
      result.current.addFast({
        id: 'fast-1',
        startedAt: '2026-01-01T10:00:00.000Z',
        endedAt: '2026-01-01T18:00:00.000Z',
      })

      result.current.addFast({
        id: 'fast-2',
        startedAt: '2026-01-02T10:00:00.000Z',
        endedAt: '2026-01-02T18:00:00.000Z',
      })
    })

    act(() => {
      result.current.deleteFast('fast-1')
    })

    expect(result.current.fasts.map((fast) => fast.id)).toEqual(['fast-2'])
  })

  it('should update an existing fast', () => {
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

    expect(result.current.fasts).toEqual([
      {
        id: 'fast-1',
        startedAt: '2026-01-01T12:00:00.000Z',
        endedAt: '2026-01-01T20:00:00.000Z',
      },
    ])
  })

  it('should keep fasts sorted after updating a fast', () => {
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

    expect(result.current.fasts.map((fast) => fast.id)).toEqual([
      'late',
      'early',
    ])
  })
})
