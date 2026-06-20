import ActiveFastingTimer from '@/components/active-fasting-timer'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'

const mockEndFasting = jest.fn()
const mockStartFasting = jest.fn()

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}))

const renderActiveFastingTimer = (props = {}) => {
  return render(
    <ActiveFastingTimer
      planId='16:8'
      endFasting={mockEndFasting}
      startFasting={mockStartFasting}
      session={{
        status: 'fasting',
        startedAt: new Date().toISOString(),
      }}
      {...props}
    />,
  )
}

describe('Active fasting timer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should contain a title "Fasting timer"', () => {
    renderActiveFastingTimer()

    expect(screen.getByText('Fasting timer')).toBeInTheDocument()
  })

  it('should display fasting badge when fasting', () => {
    renderActiveFastingTimer()

    expect(screen.getByLabelText('fasting-status')).toHaveTextContent('Fasting')
  })

  it('should display eating badge when eating', () => {
    renderActiveFastingTimer({
      session: { status: 'eating', startedAt: new Date().toISOString() },
    })

    expect(screen.getByLabelText('fasting-status')).toHaveTextContent('Eating')
  })

  it('should render countdown timer', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T12:00:00Z'))

    renderActiveFastingTimer({
      session: { status: 'fasting', startedAt: '2026-01-01T12:00:00Z' },
    })

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '16:00:00',
    )
  })

  it('should update the countdown timer every second', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T12:00:00Z'))

    renderActiveFastingTimer({
      session: { status: 'fasting', startedAt: '2026-01-01T12:00:00Z' },
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '15:59:59',
    )

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '15:59:58',
    )
  })

  it('should render progress bar', () => {
    renderActiveFastingTimer()

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render end fasting button when fasting', () => {
    renderActiveFastingTimer()

    expect(
      screen.getByRole('button', { name: /end fasting/i }),
    ).toBeInTheDocument()
  })

  it('should render start fasting button when eating', () => {
    renderActiveFastingTimer({
      session: {
        status: 'eating',
        startedAt: new Date().toISOString(),
      },
    })

    expect(
      screen.getByRole('button', { name: /start fasting/i }),
    ).toBeInTheDocument()
  })

  it('should render when the current fasting session ends', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T12:00:00Z'))

    renderActiveFastingTimer({
      session: {
        status: 'fasting',
        startedAt: '2026-01-01T12:00:00Z',
      },
    })

    expect(screen.getByText(/ends at/i)).toBeInTheDocument()
  })

  it('should open confirmation dialog', async () => {
    const user = userEvent.setup()

    renderActiveFastingTimer()

    await user.click(screen.getByRole('button', { name: /end fasting/i }))

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    })
  })

  it('should call endFasting when confirmed during fasting', async () => {
    const user = userEvent.setup()

    renderActiveFastingTimer()

    await user.click(screen.getByRole('button', { name: /end fasting/i }))
    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(mockEndFasting).toHaveBeenCalledTimes(1)
  })

  it('should call startFasting when confirmed during eating', async () => {
    const user = userEvent.setup()

    renderActiveFastingTimer({
      session: {
        status: 'eating',
        startedAt: new Date().toISOString(),
      },
    })

    await user.click(screen.getByRole('button', { name: /start fasting/i }))
    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(mockStartFasting).toHaveBeenCalledTimes(1)
  })

  it('should show remaining time in confirmation dialog', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T12:00:00Z'))

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    })

    renderActiveFastingTimer({
      session: {
        status: 'fasting',
        startedAt: '2026-01-01T12:00:00Z',
      },
    })

    await user.click(screen.getByRole('button', { name: /end fasting/i }))
    expect(screen.getByText(/16:00:00 remaining/i)).toBeInTheDocument()
  })

  it('should show elapsed overtime when session has exceeded its duration', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-02T05:00:00Z'))

    renderActiveFastingTimer({
      session: {
        status: 'fasting',
        startedAt: '2026-01-01T12:00:00Z',
      },
    })

    expect(screen.getByLabelText('fasting-timer')).toHaveTextContent(
      '+01:00:00',
    )
  })

  it('should show success toast when ending a fast', async () => {
    const user = userEvent.setup()

    renderActiveFastingTimer()

    await user.click(screen.getByRole('button', { name: /end fasting/i }))
    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(toast.success).toHaveBeenCalledWith('Fast ended')
  })

  it('should show success toast when starting a fast', async () => {
    const user = userEvent.setup()

    renderActiveFastingTimer({
      session: {
        status: 'eating',
        startedAt: new Date().toISOString(),
      },
    })

    await user.click(screen.getByRole('button', { name: /start fasting/i }))
    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(toast.success).toHaveBeenCalledWith('Fast started')
  })
})
