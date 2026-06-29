import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FastDialog from '@/components/fast-dialog'
import type { Fast } from '@/types/fasting'

const onSubmit = jest.fn()

const renderDialog = (
  existingFasts: Fast[] = [],
  props: Partial<React.ComponentProps<typeof FastDialog>> = {},
) => {
  render(
    <FastDialog
      existingFasts={existingFasts}
      dialogTitle='Add past fast'
      dialogDescription='Test description'
      submitLabel='Add fast'
      onSubmit={onSubmit}
      {...props}
    >
      <button type='button'>Open</button>
    </FastDialog>,
  )
}

const setupUser = () => userEvent.setup()

describe('FastDialog', () => {
  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('renders the trigger', () => {
    renderDialog()

    expect(screen.getByRole('button', { name: /open/i })).toBeInTheDocument()
  })

  it('opens the dialog', async () => {
    const user = setupUser()

    renderDialog()

    await user.click(screen.getByRole('button', { name: /open/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: /add past fast/i,
      }),
    ).toBeInTheDocument()
  })

  it('shows validation errors when submitting an invalid fast', async () => {
    const user = setupUser()

    renderDialog()

    await user.click(screen.getByRole('button', { name: /open/i }))
    await user.click(screen.getByRole('button', { name: /add fast/i }))

    expect(
      screen.getByText(/the start time must be before the end time/i),
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /add fast/i })).toBeDisabled()
  })

  it('does not call onSubmit when validation fails', async () => {
    const user = setupUser()

    renderDialog()

    await user.click(screen.getByRole('button', { name: /open/i }))
    await user.click(screen.getByRole('button', { name: /add fast/i }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('clears validation errors when reopened', async () => {
    const user = setupUser()

    renderDialog()

    await user.click(screen.getByRole('button', { name: /open/i }))
    await user.click(screen.getByRole('button', { name: /add fast/i }))

    expect(
      screen.getByText(/the start time must be before the end time/i),
    ).toBeInTheDocument()

    const dialog = screen.getByRole('dialog')

    const closeButton = within(dialog)
      .getAllByRole('button', { name: /^close$/i })
      .at(-1)!

    await user.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /open/i }))

    expect(
      screen.queryByText(/the start time must be before the end time/i),
    ).not.toBeInTheDocument()
  })

  it('submits a valid fast', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T23:59:59'))

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    })

    renderDialog()

    await user.click(screen.getByRole('button', { name: /open/i }))

    const endTimeInput = screen.getAllByLabelText(/^time$/i)[1]

    fireEvent.change(endTimeInput, {
      target: { value: '23:30:00' },
    })

    await user.click(screen.getByRole('button', { name: /add fast/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
  })

  it('closes after successful submission', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T23:59:59'))

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    })

    renderDialog()

    await user.click(screen.getByRole('button', { name: /open/i }))

    const endTimeInput = screen.getAllByLabelText(/^time$/i)[1]

    fireEvent.change(endTimeInput, {
      target: { value: '23:30:00' },
    })

    await user.click(screen.getByRole('button', { name: /add fast/i }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('passes selected timestamps to onSubmit', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T23:59:59'))

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    })

    renderDialog()

    await user.click(screen.getByRole('button', { name: /open/i }))

    const [startTimeInput, endTimeInput] = screen.getAllByLabelText(/^time$/i)

    fireEvent.change(startTimeInput, {
      target: { value: '21:30:00' },
    })

    fireEvent.change(endTimeInput, {
      target: { value: '23:30:00' },
    })

    await user.click(screen.getByRole('button', { name: /add fast/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    const [startedAt, endedAt] = onSubmit.mock.calls[0]

    expect(startedAt.getHours()).toBe(21)
    expect(startedAt.getMinutes()).toBe(30)

    expect(endedAt.getHours()).toBe(23)
    expect(endedAt.getMinutes()).toBe(30)
  })

  it('resets inputs when closed and reopened', async () => {
    const user = setupUser()

    renderDialog()

    await user.click(screen.getByRole('button', { name: /open/i }))

    const [startTimeInput, endTimeInput] = screen.getAllByLabelText(/^time$/i)

    fireEvent.change(startTimeInput, {
      target: { value: '20:30:00' },
    })

    fireEvent.change(endTimeInput, {
      target: { value: '22:30:00' },
    })

    const dialog = screen.getByRole('dialog')

    const closeButton = within(dialog)
      .getAllByRole('button', { name: /^close$/i })
      .at(-1)!

    await user.click(closeButton)

    await user.click(screen.getByRole('button', { name: /open/i }))

    const [reopenedStart, reopenedEnd] = screen.getAllByLabelText(/^time$/i)

    expect(reopenedStart).toHaveValue('18:00:00')
    expect(reopenedEnd).toHaveValue('17:30:00')
  })

  it('initializes with provided timestamps', async () => {
    const user = setupUser()

    renderDialog([], {
      initialStartedAt: new Date('2026-01-01T08:00:00'),
      initialEndedAt: new Date('2026-01-01T20:00:00'),
    })

    await user.click(screen.getByRole('button', { name: /open/i }))

    const [startTimeInput, endTimeInput] = screen.getAllByLabelText(/^time$/i)

    expect(startTimeInput).toHaveValue('08:00:00')
    expect(endTimeInput).toHaveValue('20:00:00')
  })

  it('restores initial timestamps when reopened', async () => {
    const user = setupUser()

    renderDialog([], {
      initialStartedAt: new Date('2026-01-01T08:00:00'),
      initialEndedAt: new Date('2026-01-01T20:00:00'),
    })

    await user.click(screen.getByRole('button', { name: /open/i }))

    const [startTimeInput] = screen.getAllByLabelText(/^time$/i)

    fireEvent.change(startTimeInput, {
      target: { value: '12:00:00' },
    })

    const dialog = screen.getByRole('dialog')

    const closeButton = within(dialog)
      .getAllByRole('button', { name: /^close$/i })
      .at(-1)!

    await user.click(closeButton)

    await user.click(screen.getByRole('button', { name: /open/i }))

    const [reopenedStart] = screen.getAllByLabelText(/^time$/i)

    expect(reopenedStart).toHaveValue('08:00:00')
  })

  it('shows overlap validation errors', async () => {
    const user = setupUser()

    renderDialog(
      [
        {
          id: '1',
          startedAt: '2026-01-01T18:00:00',
          endedAt: '2026-01-01T20:00:00',
        },
      ],
      {
        initialStartedAt: new Date('2026-01-01T18:00:00'),
        initialEndedAt: new Date('2026-01-01T17:30:00'),
      },
    )

    await user.click(screen.getByRole('button', { name: /open/i }))

    const dialog = screen.getByRole('dialog')

    const [startTimeInput, endTimeInput] =
      within(dialog).getAllByLabelText(/^time$/i)

    fireEvent.change(startTimeInput, {
      target: { value: '19:00:00' },
    })

    fireEvent.change(endTimeInput, {
      target: { value: '21:00:00' },
    })

    await user.click(
      within(dialog).getByRole('button', {
        name: /add fast/i,
      }),
    )

    expect(
      await screen.findByText(/the fast overlaps an existing fast/i),
    ).toBeInTheDocument()
  })

  it('supports controlled mode', async () => {
    const onOpenChange = jest.fn()

    renderDialog([], {
      open: true,
      onOpenChange,
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const dialog = screen.getByRole('dialog')

    const closeButton = within(dialog)
      .getAllByRole('button', { name: /^close$/i })
      .at(-1)!

    await userEvent.click(closeButton)

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
