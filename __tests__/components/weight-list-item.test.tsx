import WeightListItem from '@/components/weight-list-item'
import type { WeightEntry } from '@/types/weight'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const entry: WeightEntry = {
  id: 'weight-1',
  weightKg: 72.5,
  recordedAt: new Date('2026-01-10T12:00:00Z').toISOString(),
}

const renderComponent = (changeFromPreviousKg: number | null = null) => {
  const onDelete = jest.fn()
  const onUpdate = jest.fn()

  render(
    <WeightListItem
      entry={entry}
      onDelete={onDelete}
      onUpdate={onUpdate}
      changeFromPreviousKg={changeFromPreviousKg}
    />,
  )

  return {
    user: userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    }),
    onDelete,
    onUpdate,
  }
}

describe('WeightListItem', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-15T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the weight', () => {
    renderComponent()

    expect(screen.getByText('72.5 kg')).toBeInTheDocument()
  })

  it('renders the weight change from the previous entry', () => {
    renderComponent(-2)

    expect(screen.getByText('-2.0 kg')).toBeInTheDocument()
  })

  it('renders the weight gain from the previous entry', () => {
    renderComponent(1.5)

    expect(screen.getByText('+1.5 kg')).toBeInTheDocument()
  })

  it('does not render a weight change for the first recorded weight', () => {
    renderComponent(null)

    expect(screen.queryByText('-2.0 kg')).not.toBeInTheDocument()
    expect(screen.queryByText('+2.0 kg')).not.toBeInTheDocument()
  })

  it('renders the recording date', () => {
    renderComponent()

    expect(screen.getByText(/Sat, Jan 10, 2026/i)).toBeInTheDocument()
  })

  it('opens the dropdown menu', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button'))

    expect(screen.getByRole('menuitem', { name: /edit/i })).toBeInTheDocument()
    expect(
      screen.getByRole('menuitem', { name: /delete/i }),
    ).toBeInTheDocument()
  })

  it('opens the edit dialog', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('menuitem', { name: /edit/i }))

    expect(
      screen.getByRole('heading', { name: /edit weight/i }),
    ).toBeInTheDocument()
  })

  it('prefills the weight when editing', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('menuitem', { name: /edit/i }))

    expect(screen.getByLabelText(/^weight$/i)).toHaveValue(72.5)
  })

  it('prefills the recording date when editing', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('menuitem', { name: /edit/i }))

    expect(
      screen.getByRole('button', {
        name: /jan 10, 2026/i,
      }),
    ).toBeInTheDocument()
  })

  it('calls onUpdate after saving edits', async () => {
    const { user, onUpdate } = renderComponent()

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('menuitem', { name: /edit/i }))

    const input = screen.getByLabelText(/^weight$/i)

    await user.clear(input)
    await user.type(input, '71.8')

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate).toHaveBeenCalledWith(
      71.8,
      new Date('2026-01-10T12:00:00Z'),
    )
  })

  it('opens the delete confirmation dialog', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('menuitem', { name: /delete/i }))

    expect(
      screen.getByRole('heading', {
        name: /delete weight/i,
      }),
    ).toBeInTheDocument()
  })

  it('calls onDelete after confirming deletion', async () => {
    const { user, onDelete } = renderComponent()

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('menuitem', { name: /delete/i }))
    await user.click(screen.getByRole('button', { name: /^delete$/i }))

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('does not call onDelete when deletion is cancelled', async () => {
    const { user, onDelete } = renderComponent()

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('menuitem', { name: /delete/i }))
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(onDelete).not.toHaveBeenCalled()
  })

  it('closes the edit dialog after a successful save', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('menuitem', { name: /edit/i }))
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(
      screen.queryByRole('heading', {
        name: /edit weight/i,
      }),
    ).not.toBeInTheDocument()
  })

  it('closes the delete dialog after cancelling', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('menuitem', { name: /delete/i }))
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(
      screen.queryByRole('heading', {
        name: /delete weight/i,
      }),
    ).not.toBeInTheDocument()
  })
})
