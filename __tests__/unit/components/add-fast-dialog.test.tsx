import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddFastDialog from '@/components/add-fast-dialog'
import type { Fast } from '@/types/fasting'

jest.mock('uuid')

const addFast = jest.fn()

const renderDialog = (fasts: Fast[] = []) => {
  render(<AddFastDialog fasts={fasts} addFast={addFast} />)
}

const setupUser = () => userEvent.setup()

describe('AddFastDialog', () => {
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
    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(
      screen.getByText(/the start time must be before the end time/i),
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled()
  })

  it('should not call addFast when validation fails', async () => {
    const user = setupUser()

    renderDialog()

    await user.click(screen.getByRole('button', { name: /add fast/i }))
    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(addFast).not.toHaveBeenCalled()
  })

  it('should clear visible validation errors when the dialog is closed and reopened', async () => {
    const user = setupUser()

    renderDialog()

    await user.click(screen.getByRole('button', { name: /add fast/i }))
    await user.click(screen.getByRole('button', { name: /continue/i }))

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

    await user.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(addFast).toHaveBeenCalledTimes(1)
    })

    expect(addFast).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-uuid',
      }),
    )
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

    await user.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('should pass the selected timestamps to addFast', async () => {
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

    await user.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(addFast).toHaveBeenCalledTimes(1)
    })

    const fast = addFast.mock.calls[0][0]

    expect(fast.id).toBe('test-uuid')
    expect(new Date(fast.startedAt).getHours()).toBe(21)
    expect(new Date(fast.startedAt).getMinutes()).toBe(30)
    expect(new Date(fast.endedAt).getHours()).toBe(23)
    expect(new Date(fast.endedAt).getMinutes()).toBe(30)
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

    await user.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(addFast).toHaveBeenCalledTimes(1)
    })

    await user.click(screen.getByRole('button', { name: /add fast/i }))

    const [reopenedStartTimeInput, reopenedEndTimeInput] =
      screen.getAllByLabelText(/^time$/i)

    expect(reopenedStartTimeInput).toHaveValue('18:00:00')
    expect(reopenedEndTimeInput).toHaveValue('17:30:00')
  })
})
