import { useFasting } from '@/hooks/use-fasting'
import { renderHook, waitFor, act } from '@testing-library/react'
import {
  FASTING_PLAN_ID_STORAGE_KEY,
  FASTING_SESSION_STORAGE_KEY,
  PREFERRED_FAST_START_TIME_STORAGE_KEY,
} from '@/constants/storage-keys'
import { getFasts, addFast, updateFast, deleteFast } from '@/lib/indexed-db'
import type { Fast } from '@/types/fasting'

jest.mock('uuid')
jest.mock('@/lib/indexed-db', () => ({
  getFasts: jest.fn().mockResolvedValue([]),
  addFast: jest.fn().mockResolvedValue(undefined),
  updateFast: jest.fn().mockResolvedValue(undefined),
  deleteFast: jest.fn().mockResolvedValue(undefined),
}))

const mockedGetFasts = jest.mocked(getFasts)
const mockedAddFast = jest.mocked(addFast)
const mockedUpdateFast = jest.mocked(updateFast)
const mockedDeleteFast = jest.mocked(deleteFast)

const renderUseFasting = () => renderHook(() => useFasting())

const createFast = (): Fast => ({
  id: 'fast-1',
  startedAt: '2026-01-01T10:00:00.000Z',
  endedAt: '2026-01-01T18:00:00.000Z',
  planId: '23:1',
  streakStatus: 'completed',
})

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
    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.planId).toBeNull()
    expect(result.current.session).toBeNull()
    expect(result.current.fasts).toEqual([])
    expect(result.current.preferredFastStartTime).toBeNull()
  })

  it('hydrates the persisted plan id', async () => {
    localStorage.setItem(FASTING_PLAN_ID_STORAGE_KEY, JSON.stringify('20:4'))

    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.planId).toBe('20:4')
    })
  })

  it('hydrates the persisted session', async () => {
    localStorage.setItem(
      FASTING_SESSION_STORAGE_KEY,
      JSON.stringify({
        status: 'fasting',
        startedAt: '2026-01-01T00:00:00.000Z',
      }),
    )

    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.session).toEqual({
        status: 'fasting',
        startedAt: '2026-01-01T00:00:00.000Z',
        isAnchored: false,
      })
    })
  })

  it('migrates a session without isAnchored', async () => {
    localStorage.setItem(
      FASTING_SESSION_STORAGE_KEY,
      JSON.stringify({
        status: 'fasting',
        startedAt: '2026-01-01T00:00:00.000Z',
      }),
    )

    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.session).toEqual({
        status: 'fasting',
        startedAt: '2026-01-01T00:00:00.000Z',
        isAnchored: false,
      })
    })
  })

  it('hydrates the preferred fast start time', async () => {
    localStorage.setItem(
      PREFERRED_FAST_START_TIME_STORAGE_KEY,
      JSON.stringify({
        hour: 18,
        minute: 0,
      }),
    )

    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.preferredFastStartTime).toEqual({
        hour: 18,
        minute: 0,
      })
    })
  })

  it('hydrates fasts from indexeddb', async () => {
    mockedGetFasts.mockResolvedValueOnce([
      {
        id: 'fast-1',
        startedAt: '2026-01-01T10:00:00.000Z',
        endedAt: '2026-01-01T18:00:00.000Z',
      } as Fast,
    ])

    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.fasts).toHaveLength(1)
    })

    expect(result.current.fasts[0]).toMatchObject({
      streakStatus: 'completed',
      planId: '23:1',
    })
  })

  it('removes corrupted plan id storage', async () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    localStorage.setItem(FASTING_PLAN_ID_STORAGE_KEY, JSON.stringify('banana'))

    renderUseFasting()

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

    renderUseFasting()

    await waitFor(() => {
      expect(removeItemSpy).toHaveBeenCalledWith(FASTING_SESSION_STORAGE_KEY)
    })
  })

  it('removes corrupted preferred fast start time storage', async () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    localStorage.setItem(
      PREFERRED_FAST_START_TIME_STORAGE_KEY,
      JSON.stringify({
        hour: 100,
        minute: 500,
      }),
    )

    renderUseFasting()

    await waitFor(() => {
      expect(removeItemSpy).toHaveBeenCalledWith(
        PREFERRED_FAST_START_TIME_STORAGE_KEY,
      )
    })
  })

  it('updates the selected plan', async () => {
    const { result } = renderUseFasting()

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

    const { result } = renderUseFasting()

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

  it('updates preferred fast start time', async () => {
    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.updatePreferredFastStartTime(18, 0)
    })

    expect(result.current.preferredFastStartTime).toEqual({
      hour: 18,
      minute: 0,
    })
  })

  it('clears preferred fast start time', async () => {
    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.updatePreferredFastStartTime(18, 0)
    })

    act(() => {
      result.current.clearPreferredFastStartTime()
    })

    expect(result.current.preferredFastStartTime).toBeNull()
  })

  it('persists preferred fast start time changes', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    setItemSpy.mockClear()

    act(() => {
      result.current.updatePreferredFastStartTime(18, 0)
    })

    expect(setItemSpy).toHaveBeenCalledWith(
      PREFERRED_FAST_START_TIME_STORAGE_KEY,
      JSON.stringify({
        hour: 18,
        minute: 0,
      }),
    )
  })

  it('starts a fasting session', async () => {
    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.updatePlanId('23:1')
    })

    await act(async () => {
      await result.current.startFasting()
    })

    expect(result.current.session?.status).toBe('fasting')
  })

  it('starts an eating session', async () => {
    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.updatePlanId('23:1')
    })

    await act(async () => {
      await result.current.endFasting()
    })

    expect(result.current.session?.status).toBe('eating')
  })

  it('starts an anchored session', async () => {
    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.updatePlanId('23:1')
    })

    await act(async () => {
      await result.current.startFasting()
    })

    act(() => {
      result.current.startAnchoredSession()
    })

    expect(result.current.session?.isAnchored).toBe(true)
  })

  it('creates a completed fast when transitioning from fasting to eating', async () => {
    jest.useFakeTimers()

    jest.setSystemTime(new Date('2026-01-01T10:00:00.000Z'))

    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.updatePlanId('23:1')
    })

    await act(async () => {
      await result.current.startFasting()
    })

    jest.setSystemTime(new Date('2026-01-02T09:00:00.000Z'))

    await act(async () => {
      await result.current.endFasting()
    })

    expect(mockedAddFast).toHaveBeenCalled()
    expect(result.current.fasts).toHaveLength(1)
    expect(result.current.session?.status).toBe('eating')
  })

  it('adds a fast', async () => {
    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.addFast(createFast())
    })

    expect(result.current.fasts).toHaveLength(1)
    expect(mockedAddFast).toHaveBeenCalled()
  })

  it('rolls back addFast when persistence fails', async () => {
    mockedAddFast.mockRejectedValueOnce(new Error('boom'))

    const { result } = renderUseFasting()

    await expect(
      act(async () => {
        await result.current.addFast(createFast())
      }),
    ).rejects.toThrow('Failed to save the fast')

    expect(result.current.fasts).toEqual([])
  })

  it('deletes a fast', async () => {
    const { result } = renderUseFasting()

    await act(async () => {
      await result.current.addFast(createFast())
    })

    await act(async () => {
      await result.current.deleteFast('fast-1')
    })

    expect(result.current.fasts).toEqual([])
    expect(mockedDeleteFast).toHaveBeenCalledWith('fast-1')
  })

  it('rolls back deleteFast when persistence fails', async () => {
    mockedDeleteFast.mockRejectedValueOnce(new Error('boom'))

    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.addFast(createFast())
    })

    await expect(
      act(async () => {
        await result.current.deleteFast('fast-1')
      }),
    ).rejects.toThrow('Failed to delete the fast')

    expect(result.current.fasts).toHaveLength(1)
  })

  it('updates a fast', async () => {
    const { result } = renderUseFasting()

    await act(async () => {
      await result.current.addFast(createFast())
    })

    await act(async () => {
      await result.current.updateFast({
        ...createFast(),
        startedAt: '2026-01-01T12:00:00.000Z',
        endedAt: '2026-01-01T20:00:00.000Z',
      })
    })

    expect(mockedUpdateFast).toHaveBeenCalled()
  })

  it('rolls back updateFast when persistence fails', async () => {
    mockedUpdateFast.mockRejectedValueOnce(new Error('boom'))

    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.addFast(createFast())
    })

    await expect(
      act(async () => {
        await result.current.updateFast({
          ...createFast(),
          startedAt: '2026-01-02T10:00:00.000Z',
          endedAt: '2026-01-02T18:00:00.000Z',
        })
      }),
    ).rejects.toThrow('Failed to update the fast')

    expect(result.current.fasts[0].startedAt).toBe('2026-01-01T10:00:00.000Z')
  })

  it('logs hydration failures from indexeddb', async () => {
    mockedGetFasts.mockRejectedValueOnce(new Error('boom'))

    renderUseFasting()

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Hydrating fasts failed',
        expect.any(Error),
      )
    })
  })

  it('updates the current session startedAt', async () => {
    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.updatePlanId('23:1')
    })

    await act(async () => {
      await result.current.startFasting(new Date('2026-01-01T18:00:00.000Z'))
    })

    act(() => {
      result.current.updateSessionStartedAt(
        new Date('2026-01-01T20:30:00.000Z'),
      )
    })

    expect(result.current.session).toEqual({
      status: 'fasting',
      startedAt: '2026-01-01T20:30:00.000Z',
      isAnchored: false,
    })
  })

  it('does nothing when updating the session start time without an active session', async () => {
    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.updateSessionStartedAt(
        new Date('2026-01-01T20:30:00.000Z'),
      )
    })

    expect(result.current.session).toBeNull()
  })

  it('persists updated session startedAt', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result } = renderUseFasting()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.updatePlanId('23:1')
    })

    await act(async () => {
      await result.current.startFasting(new Date('2026-01-01T18:00:00.000Z'))
    })

    setItemSpy.mockClear()

    act(() => {
      result.current.updateSessionStartedAt(
        new Date('2026-01-01T20:30:00.000Z'),
      )
    })

    expect(setItemSpy).toHaveBeenCalledWith(
      FASTING_SESSION_STORAGE_KEY,
      JSON.stringify({
        status: 'fasting',
        startedAt: '2026-01-01T20:30:00.000Z',
        isAnchored: false,
      }),
    )
  })
})
