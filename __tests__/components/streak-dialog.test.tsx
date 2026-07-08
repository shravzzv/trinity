import StreakDialog from '@/components/streak-dialog'
import { Fast } from '@/types/fasting'
import { render, screen } from '@testing-library/react'
import userEvent, { UserEvent } from '@testing-library/user-event'

const renderComponent = (fasts: Fast[] = []) => {
  render(<StreakDialog fasts={fasts} />)

  return {
    user: userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    }),
  }
}

const openDialog = async (user: UserEvent) => {
  await user.click(screen.getByRole('button', { name: /streak/i }))
}

describe('StreakDialog', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-07-06'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the trigger button', () => {
    renderComponent()

    expect(screen.getByRole('button', { name: /streak/i })).toBeInTheDocument()
  })

  it('opens the dialog', async () => {
    const { user } = renderComponent()
    await openDialog(user)

    expect(screen.getByRole('heading', { name: 'Streak' })).toBeInTheDocument()
  })

  it('renders the description', async () => {
    const { user } = renderComponent()
    await openDialog(user)

    expect(
      screen.getByText(
        /your streak grows each day you complete your fasting goal/i,
      ),
    ).toBeInTheDocument()
  })

  it('renders the current streak', async () => {
    const { user } = renderComponent()
    await openDialog(user)

    expect(screen.getByText(/current streak/i)).toBeInTheDocument()
  })

  it('renders the longest streak', async () => {
    const { user } = renderComponent()
    await openDialog(user)

    expect(screen.getByText(/longest streak/i)).toBeInTheDocument()
  })

  it('does not render the personal best badge when there is no active streak', async () => {
    const { user } = renderComponent()
    await openDialog(user)

    expect(screen.queryByText(/personal best/i)).not.toBeInTheDocument()
  })

  it('renders the calendar legend', async () => {
    const { user } = renderComponent()
    await openDialog(user)

    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Missed')).toBeInTheDocument()
    expect(screen.getByText('Anchored')).toBeInTheDocument()
  })

  it('renders the calendar', async () => {
    const { user } = renderComponent()
    await openDialog(user)

    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('renders streak days from fasting history', async () => {
    const { user } = renderComponent([
      {
        id: '1',
        startedAt: '2026-07-01T18:00:00.000Z',
        endedAt: '2026-07-02T17:00:00.000Z',
        streakStatus: 'completed',
        planId: '23:1',
      },
      {
        id: '2',
        startedAt: '2026-07-02T18:00:00.000Z',
        endedAt: '2026-07-03T12:00:00.000Z',
        streakStatus: 'missed',
        planId: '23:1',
      },
      {
        id: '3',
        startedAt: '2026-07-03T18:00:00.000Z',
        endedAt: '2026-07-04T17:00:00.000Z',
        streakStatus: 'anchored',
        planId: '23:1',
      },
    ])

    await user.click(screen.getByRole('button', { name: /streak/i }))

    expect(screen.getByRole('grid')).toBeInTheDocument()
  })
})
