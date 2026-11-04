import SuccessfulFastDialog from '@/components/successful-fast-dialog'
import { SUCCESSFUL_FAST_STARTED_AT } from '@/constants/storage-keys'
import { xpRewards } from '@/constants/gamification'
import { act, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

jest.mock('motion/react', () => {
  const MockMotionComponent = ({
    children,
    onAnimationComplete,
    ...props
  }: {
    children?: React.ReactNode
    onAnimationComplete?: () => void
    [key: string]: unknown
  }) => {
    React.useEffect(() => {
      onAnimationComplete?.()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return React.createElement('div', props, children)
  }

  return {
    motion: {
      p: MockMotionComponent,
      div: MockMotionComponent,
      create: () => MockMotionComponent,
    },
  }
})

jest.mock('@number-flow/react', () => ({
  __esModule: true,
  default: ({ value, suffix }: { value: number; suffix?: string }) =>
    React.createElement('span', null, `${value}${suffix ?? ''}`),

  NumberFlowGroup: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}))

const mockStreak = 8

jest.mock('@/providers/gamification-provider', () => ({
  useGamificationContext: () => ({
    streak: mockStreak,
  }),
}))

const mockSession = {
  startedAt: '2026-11-04T05:30:00.000Z',
}

jest.mock('@/providers/fasting-provider', () => ({
  useFastingContext: () => ({
    session: mockSession,
  }),
}))

const FAST_STARTED_AT = '2026-11-03T06:00:00.000Z'

const renderComponent = (open = true, onOpenChange = jest.fn()) => {
  return render(
    <SuccessfulFastDialog open={open} onOpenChange={onOpenChange} />,
  )
}

const completeAnimations = () => {
  act(() => {
    // let all timers run out
    jest.advanceTimersByTime(10000)
  })
}

describe('SuccessfulFastDialog', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    localStorage.clear()

    localStorage.setItem(SUCCESSFUL_FAST_STARTED_AT, FAST_STARTED_AT)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders the success heading, description, and icon', () => {
      renderComponent()

      expect(
        screen.getByLabelText('successful-fast-heading'),
      ).toBeInTheDocument()

      expect(
        screen.getByLabelText('successful-fast-description'),
      ).toBeInTheDocument()

      expect(screen.getByLabelText('successful-fast-icon')).toBeInTheDocument()
    })

    it('renders the fasting duration section', () => {
      renderComponent()

      expect(screen.getByText(/fasting duration/i)).toBeInTheDocument()
    })

    it('renders the XP card', () => {
      renderComponent()

      expect(screen.getByLabelText('xp-earned-card')).toBeInTheDocument()
    })

    it('renders the streak card', () => {
      renderComponent()

      expect(screen.getByLabelText('streak-card')).toBeInTheDocument()
    })
  })

  describe('fasting duration', () => {
    it('starts the counters at zero', () => {
      renderComponent()

      expect(screen.getByText('0h')).toBeInTheDocument()
      expect(screen.getByText('0m')).toBeInTheDocument()
    })

    it('calculates and displays the correct fasting duration', () => {
      renderComponent()
      completeAnimations()

      // 2026-11-03 06:00 to 2026-11-04 05:30 = 23h 30m.
      expect(screen.getByText('23h')).toBeInTheDocument()
      expect(screen.getByText('30m')).toBeInTheDocument()
    })
  })

  describe('XP animation', () => {
    it('starts at zero', () => {
      renderComponent()

      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('increments to the completed-fast XP reward', () => {
      renderComponent()
      completeAnimations()

      expect(
        screen.getByText(String(xpRewards.completedFast)),
      ).toBeInTheDocument()
    })
  })

  describe('streak animation', () => {
    it('initially displays the previous streak', () => {
      renderComponent()

      expect(screen.getByText('7')).toBeInTheDocument()
    })

    it('updates to the current streak after the XP animation', () => {
      renderComponent()
      completeAnimations()

      expect(screen.getByText('8')).toBeInTheDocument()
    })

    it('updates the streak after the XP animation', () => {
      renderComponent()

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(screen.getByText('0')).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(2000)
      })

      expect(screen.getByText('8')).toBeInTheDocument()
    })
  })

  describe('dismissal', () => {
    it('notifies the parent when the dialog closes', () => {
      const onOpenChange = jest.fn()

      renderComponent(true, onOpenChange)

      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('removes the successful fast timestamp when dismissed', () => {
      renderComponent()

      expect(localStorage.getItem(SUCCESSFUL_FAST_STARTED_AT)).not.toBeNull()

      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      expect(localStorage.getItem(SUCCESSFUL_FAST_STARTED_AT)).toBeNull()
    })

    it('resets the counters when dismissed', () => {
      renderComponent()
      completeAnimations()

      expect(screen.getByText('23h')).toBeInTheDocument()
      expect(screen.getByText('30m')).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      expect(screen.getByText('0h')).toBeInTheDocument()
      expect(screen.getByText('0m')).toBeInTheDocument()
      expect(screen.getByText('0', { selector: 'span' })).toBeInTheDocument()
      expect(screen.getByText('7')).toBeInTheDocument()
    })

    it('does not remove the timestamp when initially closed', () => {
      renderComponent(false)

      expect(localStorage.getItem(SUCCESSFUL_FAST_STARTED_AT)).toBe(
        FAST_STARTED_AT,
      )
    })
  })
})
