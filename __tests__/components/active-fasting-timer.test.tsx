import ActiveFastingTimer from '@/components/active-fasting-timer'
import { ANCHOR_STREAK_REQUIREMENT, xpRewards } from '@/constants/gamification'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'

const mockEndFasting = jest.fn()
const mockStartFasting = jest.fn()
const mockUpdateSessionStartedAt = jest.fn()
const mockAwardAnchor = jest.fn()
const mockAwardXp = jest.fn()
const mockIncrementStreak = jest.fn()
const mockResetStreak = jest.fn()
const mockSpendAnchor = jest.fn()
const mockStartAnchoredSession = jest.fn()

jest.mock('sonner')

jest.mock('@/components/edit-session-started-at-dialog', () => ({
  __esModule: true,
  default: ({
    children,
    onSave,
  }: {
    children: React.ReactNode
    onSave: (date: Date) => void
  }) => (
    <div>
      {children}

      <button
        type='button'
        onClick={() => onSave(new Date('2026-01-01T10:00:00.000Z'))}
      >
        Mock Update Session
      </button>
    </div>
  ),
}))

const renderComponent = (
  props: Partial<React.ComponentProps<typeof ActiveFastingTimer>> = {},
) => {
  render(
    <ActiveFastingTimer
      streak={0}
      anchors={0}
      fasts={[]}
      planId='16:8'
      endFasting={mockEndFasting}
      startFasting={mockStartFasting}
      updateSessionStartedAt={mockUpdateSessionStartedAt}
      awardAnchor={mockAwardAnchor}
      awardXp={mockAwardXp}
      incrementStreak={mockIncrementStreak}
      resetStreak={mockResetStreak}
      spendAnchor={mockSpendAnchor}
      startAnchoredSession={mockStartAnchoredSession}
      session={{
        status: 'fasting',
        startedAt: new Date().toISOString(),
        isAnchored: false,
      }}
      {...props}
    />,
  )

  return {
    user: userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    }),
  }
}

describe('ActiveFastingTimer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the title', () => {
    renderComponent()

    expect(screen.getByText('Fasting timer')).toBeInTheDocument()
  })

  it('renders fasting status', () => {
    renderComponent()

    expect(screen.getByText(/^Fasting$/)).toBeInTheDocument()
  })

  it('renders eating status', () => {
    renderComponent({
      session: {
        status: 'eating',
        startedAt: new Date().toISOString(),
        isAnchored: false,
      },
    })

    expect(screen.getByText(/^Eating$/)).toBeInTheDocument()
  })

  it('renders countdown timer', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T12:00:00Z'))

    renderComponent({
      session: {
        status: 'fasting',
        startedAt: '2026-01-01T12:00:00Z',
        isAnchored: false,
      },
    })

    expect(screen.getByLabelText('fasting-timer')).toHaveTextContent('16:00:00')
  })

  it('updates the countdown timer every second', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T12:00:00Z'))

    renderComponent({
      session: {
        status: 'fasting',
        startedAt: '2026-01-01T12:00:00Z',
        isAnchored: false,
      },
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByLabelText('fasting-timer')).toHaveTextContent('15:59:59')

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByLabelText('fasting-timer')).toHaveTextContent('15:59:58')
  })

  it('renders progress bar', () => {
    renderComponent()

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders end fasting button when fasting', () => {
    renderComponent()

    expect(
      screen.getByRole('button', { name: /end fasting/i }),
    ).toBeInTheDocument()
  })

  it('renders start fasting button when eating', () => {
    renderComponent({
      session: {
        status: 'eating',
        startedAt: new Date().toISOString(),
        isAnchored: false,
      },
    })

    expect(
      screen.getByRole('button', { name: /start fasting/i }),
    ).toBeInTheDocument()
  })

  it('renders started section', () => {
    renderComponent()

    expect(screen.getByText('Started')).toBeInTheDocument()
  })

  it('renders ends section', () => {
    renderComponent()

    expect(screen.getByText('Ends')).toBeInTheDocument()
  })

  it('shows goal reached label when session duration has been exceeded', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-02T05:00:00Z'))

    renderComponent({
      session: {
        status: 'fasting',
        startedAt: '2026-01-01T12:00:00Z',
        isAnchored: false,
      },
    })

    expect(screen.getByText('Goal reached at')).toBeInTheDocument()
  })

  it('opens confirmation dialog', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: /end fasting/i }))

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    })
  })

  it('calls endFasting when confirmed during fasting', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: /end fasting/i }))
    await user.click(screen.getByRole('button', { name: /end fasting/i }))

    expect(mockEndFasting).toHaveBeenCalledTimes(1)
    expect(mockEndFasting).toHaveBeenCalledTimes(1)
    expect(mockAwardXp).toHaveBeenCalledWith(xpRewards.missedFast)
    expect(mockResetStreak).toHaveBeenCalled()
  })

  it('calls startFasting when confirmed during eating', async () => {
    const { user } = renderComponent({
      session: {
        status: 'eating',
        startedAt: new Date().toISOString(),
        isAnchored: false,
      },
    })

    await user.click(screen.getByRole('button', { name: /start fasting/i }))
    await user.click(screen.getByRole('button', { name: /start fasting/i }))

    expect(mockStartFasting).toHaveBeenCalledTimes(1)
    expect(mockStartFasting).toHaveBeenCalledTimes(1)

    expect(mockAwardXp).not.toHaveBeenCalled()
    expect(mockIncrementStreak).not.toHaveBeenCalled()
    expect(mockResetStreak).not.toHaveBeenCalled()
    expect(mockAwardAnchor).not.toHaveBeenCalled()
  })

  it('shows remaining time in confirmation dialog', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T12:00:00Z'))

    const { user } = renderComponent({
      session: {
        status: 'fasting',
        startedAt: '2026-01-01T12:00:00Z',
        isAnchored: false,
      },
    })

    await user.click(screen.getByRole('button', { name: /end fasting/i }))

    expect(screen.getByText(/16:00:00 remaining/i)).toBeInTheDocument()
  })

  it('shows elapsed overtime when session has exceeded its duration', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-02T05:00:00Z'))

    renderComponent({
      session: {
        status: 'fasting',
        startedAt: '2026-01-01T12:00:00Z',
        isAnchored: false,
      },
    })

    expect(screen.getByLabelText('fasting-timer')).toHaveTextContent(
      '+01:00:00',
    )
  })

  it('shows success toast when starting a fast', async () => {
    const { user } = renderComponent({
      session: {
        status: 'eating',
        startedAt: new Date().toISOString(),
        isAnchored: false,
      },
    })

    await user.click(screen.getByRole('button', { name: /start fasting/i }))
    await user.click(screen.getByRole('button', { name: /start fasting/i }))

    expect(toast.success).toHaveBeenCalledWith('Fast started')
  })

  it('shows error toast when ending a fast fails', async () => {
    mockEndFasting.mockRejectedValueOnce(new Error('Boom'))

    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: /end fasting/i }))
    await user.click(screen.getByRole('button', { name: /end fasting/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Boom')
    })
  })

  it('shows error toast when starting a fast fails', async () => {
    mockStartFasting.mockRejectedValueOnce(new Error('Boom'))

    const { user } = renderComponent({
      session: {
        status: 'eating',
        startedAt: new Date().toISOString(),
        isAnchored: false,
      },
    })

    await user.click(screen.getByRole('button', { name: /start fasting/i }))
    await user.click(screen.getByRole('button', { name: /start fasting/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Boom')
    })
  })

  it('updates the session started at', async () => {
    const { user } = renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: /mock update session/i,
      }),
    )

    expect(mockUpdateSessionStartedAt).toHaveBeenCalledWith(
      new Date('2026-01-01T10:00:00.000Z'),
    )
  })

  it('shows a success toast when updating the session', async () => {
    const { user } = renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: /mock update session/i,
      }),
    )

    expect(toast.success).toHaveBeenCalledWith('Session updated')
  })

  it('awards completed fast XP when the fasting goal has been reached', async () => {
    jest.setSystemTime(new Date('2026-01-02T05:00:00Z'))

    const { user } = renderComponent({
      session: {
        status: 'fasting',
        startedAt: '2026-01-01T12:00:00Z',
        isAnchored: false,
      },
    })

    await user.click(screen.getByRole('button', { name: /end fasting/i }))
    await user.click(screen.getByRole('button', { name: /end fasting/i }))

    expect(mockAwardXp).toHaveBeenCalledWith(xpRewards.completedFast)
  })

  it('increments the streak after completing a fast', async () => {
    jest.setSystemTime(new Date('2026-01-02T05:00:00Z'))

    const { user } = renderComponent({
      session: {
        status: 'fasting',
        startedAt: '2026-01-01T12:00:00Z',
        isAnchored: false,
      },
    })

    await user.click(screen.getByRole('button', { name: /end fasting/i }))
    await user.click(screen.getByRole('button', { name: /end fasting/i }))

    expect(mockIncrementStreak).toHaveBeenCalled()
  })

  it('awards an Anchor when the streak reaches the requirement', async () => {
    jest.setSystemTime(new Date('2026-01-02T05:00:00Z'))

    const { user } = renderComponent({
      streak: ANCHOR_STREAK_REQUIREMENT - 1,
      session: {
        status: 'fasting',
        startedAt: '2026-01-01T12:00:00Z',
        isAnchored: false,
      },
    })

    await user.click(screen.getByRole('button', { name: /end fasting/i }))
    await user.click(screen.getByRole('button', { name: /end fasting/i }))

    expect(mockAwardAnchor).toHaveBeenCalled()
  })

  it('does not award an Anchor before the streak requirement is reached', async () => {
    jest.setSystemTime(new Date('2026-01-02T05:00:00Z'))

    const { user } = renderComponent({
      streak: 2,
      session: {
        status: 'fasting',
        startedAt: '2026-01-01T12:00:00Z',
        isAnchored: false,
      },
    })

    await user.click(screen.getByRole('button', { name: /end fasting/i }))
    await user.click(screen.getByRole('button', { name: /end fasting/i }))

    expect(mockAwardAnchor).not.toHaveBeenCalled()
  })

  it('starts a new fast when ending an anchored fast', async () => {
    const { user } = renderComponent({
      session: {
        status: 'fasting',
        startedAt: new Date().toISOString(),
        isAnchored: true,
      },
    })

    await user.click(screen.getByRole('button', { name: /start fasting/i }))
    await user.click(screen.getByRole('button', { name: /start fasting/i }))

    expect(mockStartFasting).toHaveBeenCalled()
    expect(mockAwardXp).toHaveBeenCalledWith(xpRewards.completedAnchoredFast)
    expect(mockIncrementStreak).toHaveBeenCalled()
  })

  it('starts an anchored fast and spends an Anchor', async () => {
    const { user } = renderComponent({
      anchors: 1,
    })

    await user.click(screen.getByRole('button', { name: /use anchor/i }))
    await user.click(screen.getByRole('button', { name: /use anchor/i }))

    expect(mockStartAnchoredSession).toHaveBeenCalled()
    expect(mockSpendAnchor).toHaveBeenCalled()
    expect(mockAwardXp).toHaveBeenCalledWith(xpRewards.startedAnchoredFast)
  })
})
