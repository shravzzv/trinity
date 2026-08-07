import { renderHook, act, waitFor } from '@testing-library/react'
import { useGamification } from '@/hooks/use-gamification'
import { INITIAL_ANCHORS } from '@/constants/gamification'

jest.mock('@/lib/sync', () => ({
  requestSync: jest.fn().mockResolvedValue(undefined),
  markProfileNeedsSync: jest.fn().mockResolvedValue(undefined),
}))

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

      expect(result.current.anchors).toBe(Math.max(INITIAL_ANCHORS - 1, 0))
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

  describe('achievements', () => {
    it('has no current achievement initially', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.currentAchievement).toBeNull()
    })

    it('queues a level achievement when reaching a new level', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.awardXp(100)
      })

      expect(result.current.currentAchievement).toEqual({
        type: 'level',
        title: 'Level 1 reached!',
        description:
          'Keep going. Every fast brings you closer to your next milestone.',
      })
    })

    it('does not queue a level achievement when staying within the same level', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.awardXp(25)
      })

      expect(result.current.currentAchievement).toBeNull()
    })

    it('queues an Anchor achievement', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.awardAnchor()
      })

      expect(result.current.currentAchievement).toEqual({
        type: 'anchor',
        title: 'Anchor earned!',
        description: 'You earned an Anchor by maintaining your fasting streak.',
      })
    })

    it('queues a streak achievement at a milestone', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        for (let i = 0; i < 7; i++) {
          result.current.incrementStreak()
        }
      })

      expect(result.current.currentAchievement).toEqual({
        type: 'streak',
        title: '7 day streak!',
        description: 'Your consistency is paying off. Keep the momentum going!',
      })
    })

    it('does not queue a streak achievement before a milestone', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        for (let i = 0; i < 6; i++) {
          result.current.incrementStreak()
        }
      })

      expect(result.current.currentAchievement).toBeNull()
    })

    it('dismisses the current achievement', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.awardAnchor()
      })

      expect(result.current.currentAchievement).not.toBeNull()

      act(() => {
        result.current.dismissAchievement()
      })

      expect(result.current.currentAchievement).toBeNull()
    })

    it('shows queued achievements in the order they were earned', async () => {
      const { result } = renderHook(() => useGamification())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.awardAnchor()
        result.current.awardXp(100)
      })

      expect(result.current.currentAchievement?.type).toBe('anchor')

      act(() => {
        result.current.dismissAchievement()
      })

      expect(result.current.currentAchievement?.type).toBe('level')
    })
  })
})
