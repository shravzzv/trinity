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
import { Plus } from 'lucide-react'

const onSubmit = jest.fn()

const renderDialog = (
  existingFasts: Fast[] = [],
  props: Partial<React.ComponentProps<typeof FastDialog>> = {},
) => {
  render(
    <FastDialog
      existingFasts={existingFasts}
      triggerTitle='Add fast'
      triggerIcon={Plus}
      dialogTitle='Add past fast'
      dialogDescription='Test description'
      submitLabel='Add fast'
      onSubmit={onSubmit}
      {...props}
    />,
  )
}

const setupUser = () => userEvent.setup()

describe('FastDialog', () => {
  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('should render the trigger button', () => {
    renderDialog()

    expect(
      screen.getByRole('button', { name: /add fast/i }),
    ).toBeInTheDocument()
  })

  it('should open the dialog when the trigger is clicked', async () => {
    const user = setupUser()

    renderDialog()

    await user.click(screen.getByRole('button', { name: /add fast/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: /add past fast/i,
      }),
    ).toBeInTheDocument()
  })

  it('should show validation errors when submitting an invalid fast', async () => {
    const user = setupUser()

    renderDialog()

    await user.click(screen.getByRole('button', { name: /add fast/i }))
    await user.click(screen.getByRole('button', { name: /add fast/i }))

    expect(
      screen.getByText(/the start time must be before the end time/i),
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /add fast/i })).toBeDisabled()
  })

  it('should not call onSubmit when validation fails', async () => {
    const user = setupUser()

    renderDialog()

    await user.click(screen.getByRole('button', { name: /add fast/i }))
    await user.click(screen.getByRole('button', { name: /add fast/i }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should clear visible validation errors when the dialog is closed and reopened', async () => {
    const user = setupUser()

    renderDialog()

    await user.click(screen.getByRole('button', { name: /add fast/i }))
    await user.click(screen.getByRole('button', { name: /add fast/i }))

    expect(
      screen.getByText(/the start time must be before the end time/i),
    ).toBeInTheDocument()

    const dialog = screen.getByRole('dialog')

    const closeButtons = within(dialog).getAllByRole('button', {
      name: /^close$/i,
    })

    await user.click(closeButtons[1])

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /add fast/i }))

    expect(
      screen.queryByText(/the start time must be before the end time/i),
    ).not.toBeInTheDocument()
  })

  it('should submit a valid fast', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T23:59:59'))

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    })

    renderDialog()

    await user.click(screen.getByRole('button', { name: /add fast/i }))

    const endTimeInput = screen.getAllByLabelText(/^time$/i)[1]

    fireEvent.change(endTimeInput, {
      target: {
        value: '23:30:00',
      },
    })

    expect(endTimeInput).toHaveValue('23:30:00')

    await user.click(screen.getByRole('button', { name: /add fast/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
  })

  it('should close the dialog after a successful submission', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T23:59:59'))

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    })

    renderDialog()

    await user.click(screen.getByRole('button', { name: /add fast/i }))

    const endTimeInput = screen.getAllByLabelText(/^time$/i)[1]

    fireEvent.change(endTimeInput, {
      target: {
        value: '23:30:00',
      },
    })

    await user.click(screen.getByRole('button', { name: /add fast/i }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('should pass the selected timestamps to onSubmit', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T23:59:59'))

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    })

    renderDialog()

    await user.click(screen.getByRole('button', { name: /add fast/i }))

    const [startTimeInput, endTimeInput] = screen.getAllByLabelText(/^time$/i)

    fireEvent.change(startTimeInput, {
      target: {
        value: '21:30:00',
      },
    })

    fireEvent.change(endTimeInput, {
      target: {
        value: '23:30:00',
      },
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

  it('should reset the inputs on successful submission', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-01T23:59:59'))

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    })

    renderDialog()

    await user.click(screen.getByRole('button', { name: /add fast/i }))

    const [startTimeInput, endTimeInput] = screen.getAllByLabelText(/^time$/i)

    fireEvent.change(startTimeInput, {
      target: {
        value: '20:30:00',
      },
    })

    fireEvent.change(endTimeInput, {
      target: {
        value: '23:30:00',
      },
    })

    expect(startTimeInput).toHaveValue('20:30:00')
    expect(endTimeInput).toHaveValue('23:30:00')

    await user.click(screen.getByRole('button', { name: /add fast/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    await user.click(screen.getByRole('button', { name: /add fast/i }))

    const [reopenedStartTimeInput, reopenedEndTimeInput] =
      screen.getAllByLabelText(/^time$/i)

    expect(reopenedStartTimeInput).toHaveValue('18:00:00')
    expect(reopenedEndTimeInput).toHaveValue('17:30:00')
  })

  it('should initialize the form with the provided timestamps', async () => {
    const user = setupUser()

    renderDialog([], {
      initialStartedAt: new Date('2026-01-01T08:00:00'),
      initialEndedAt: new Date('2026-01-01T20:00:00'),
    })

    await user.click(screen.getByRole('button', { name: /add fast/i }))

    const [startTimeInput, endTimeInput] = screen.getAllByLabelText(/^time$/i)

    expect(startTimeInput).toHaveValue('08:00:00')
    expect(endTimeInput).toHaveValue('20:00:00')
  })

  it('should show an overlap validation error', async () => {
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

    await user.click(screen.getByRole('button', { name: /add fast/i }))

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
})
