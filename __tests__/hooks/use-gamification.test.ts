import { renderHook, act, waitFor } from '@testing-library/react'
import { useGamification } from '@/hooks/use-gamification'
import {
  ANCHORS_STORAGE_KEY,
  STREAK_STORAGE_KEY,
  XP_STORAGE_KEY,
} from '@/constants/storage-keys'
import { INITIAL_ANCHORS } from '@/constants/gamification'

describe('useGamification', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    localStorage.clear()
    jest.restoreAllMocks()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('initial state', () => {
    it('initializes with default values', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.xp).toBe(0)
      expect(result.current.streak).toBe(0)
      expect(result.current.anchors).toBe(INITIAL_ANCHORS)
    })
  })

  describe('XP', () => {
    it('awards XP', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.awardXp(25)
      })

      expect(result.current.xp).toBe(25)
    })

    it('accumulates XP', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.awardXp(10)
        result.current.awardXp(5)
      })

      expect(result.current.xp).toBe(15)
    })
  })

  describe('streak', () => {
    it('increments the streak', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.incrementStreak()
      })

      expect(result.current.streak).toBe(1)
    })

    it('resets the streak', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.incrementStreak()
        result.current.incrementStreak()
        result.current.resetStreak()
      })

      expect(result.current.streak).toBe(0)
    })
  })

  describe('anchors', () => {
    it('awards an Anchor', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.awardAnchor()
      })

      expect(result.current.anchors).toBe(INITIAL_ANCHORS + 1)
    })

    it('spends an Anchor', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.spendAnchor()
      })

      expect(result.current.anchors).toBe(INITIAL_ANCHORS - 1)
    })

    it('does not spend an Anchor when none are available', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.spendAnchor()
        result.current.spendAnchor()
      })

      expect(result.current.anchors).toBe(0)
    })
  })

  describe('hydration', () => {
    it('hydrates XP from localStorage', async () => {
      localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(123))

      const { result } = renderHook(() => useGamification())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.xp).toBe(123)
    })

    it('hydrates streak from localStorage', async () => {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(7))

      const { result } = renderHook(() => useGamification())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.streak).toBe(7)
    })

    it('hydrates anchors from localStorage', async () => {
      localStorage.setItem(ANCHORS_STORAGE_KEY, JSON.stringify(5))

      const { result } = renderHook(() => useGamification())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.anchors).toBe(5)
    })

    it('removes corrupted XP from localStorage', async () => {
      localStorage.setItem(XP_STORAGE_KEY, JSON.stringify('bad'))

      renderHook(() => useGamification())

      await waitFor(() => {
        expect(localStorage.getItem(XP_STORAGE_KEY)).toBe('0')
      })

      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('removes corrupted streak from localStorage', async () => {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify('bad'))

      renderHook(() => useGamification())

      await waitFor(() => {
        expect(localStorage.getItem(STREAK_STORAGE_KEY)).toBe('0')
      })

      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('removes corrupted anchors from localStorage', async () => {
      localStorage.setItem(ANCHORS_STORAGE_KEY, JSON.stringify('bad'))

      renderHook(() => useGamification())

      await waitFor(() => {
        expect(localStorage.getItem(ANCHORS_STORAGE_KEY)).toBe(
          INITIAL_ANCHORS.toString(),
        )
      })

      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('synchronization', () => {
    it('syncs XP to localStorage', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.awardXp(50)
      })

      expect(localStorage.getItem(XP_STORAGE_KEY)).toBe('50')
    })

    it('syncs streak to localStorage', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.incrementStreak()
      })

      expect(localStorage.getItem(STREAK_STORAGE_KEY)).toBe('1')
    })

    it('syncs anchors to localStorage', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.awardAnchor()
      })

      expect(localStorage.getItem(ANCHORS_STORAGE_KEY)).toBe('2')
    })
  })
})
