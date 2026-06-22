import { useFasting } from '@/hooks/use-fasting'
import { renderHook, waitFor, act } from '@testing-library/react'
import { STORAGE_KEY } from '@/constants/storage-keys'

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
      STORAGE_KEY,
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
    localStorage.setItem(STORAGE_KEY, '{broken json')

    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    expect(result.current.planId).toBe('16:8')
    expect(result.current.session).toBeNull()
  })

  it('should remove corrupted local storage', async () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    localStorage.setItem(STORAGE_KEY, '{broken json')

    const { result } = renderHook(() => useFasting())

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true)
    })

    expect(removeItemSpy).toHaveBeenCalledWith(STORAGE_KEY)
  })

  it('should fall back to default state when session is invalid', async () => {
    localStorage.setItem(
      STORAGE_KEY,
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
      STORAGE_KEY,
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
      STORAGE_KEY,
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
})
