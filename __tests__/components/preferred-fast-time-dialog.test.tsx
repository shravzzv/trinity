import PreferredFastTimeDialog from '@/components/preferred-fast-time-dialog'
import type { FastingPlan } from '@/types/fasting'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('@/lib/fasting', () => ({
  formatPreferredTime: jest.fn(() => '5:30 PM'),
  getPreferredFastSchedule: jest.fn(() => ({
    startsAt: {
      hour: 18,
      minute: 0,
    },
    endsAt: {
      hour: 17,
      minute: 30,
    },
    endsNextDay: true,
  })),
}))

const selectedPlan: FastingPlan = {
  id: '16:8',
  title: '16:8',
  fastingHours: 16,
  eatingHours: 8,
}

const renderComponent = (
  props?: Partial<React.ComponentProps<typeof PreferredFastTimeDialog>>,
) => {
  const onSubmit = jest.fn()
  const onDeleteSchedule = jest.fn()
  const onOpenChange = jest.fn()

  render(
    <PreferredFastTimeDialog
      dialogTitle='Preferred schedule'
      dialogDescription='Choose your preferred fasting start time.'
      selectedPlan={selectedPlan}
      preferredFastStartTime={{
        hour: 18,
        minute: 0,
      }}
      onSubmit={onSubmit}
      onDeleteSchedule={onDeleteSchedule}
      allowDeleteSchedule
      onOpenChange={onOpenChange}
      {...props}
    >
      <button>Open</button>
    </PreferredFastTimeDialog>,
  )

  return {
    user: userEvent.setup(),
    onSubmit,
    onDeleteSchedule,
    onOpenChange,
  }
}

describe('PreferredFastTimeDialog', () => {
  it('should render the trigger', () => {
    renderComponent()

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('should open the dialog', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(
      screen.getByRole('heading', {
        name: 'Preferred schedule',
      }),
    ).toBeInTheDocument()
  })

  it('should initialize the input from the preferred start time', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByLabelText(/preferred start time/i)).toHaveValue('18:00')
  })

  it('should initialize to 18:00 when no preferred time exists', async () => {
    const { user } = renderComponent({
      preferredFastStartTime: null,
    })

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByLabelText(/preferred start time/i)).toHaveValue('18:00')
  })

  it('should disable save when nothing has changed', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('should enable save after changing the time', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    const input = screen.getByLabelText(/preferred start time/i)

    fireEvent.change(input, {
      target: { value: '19:30' },
    })

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
  })

  it('should call onSubmit with the selected time', async () => {
    const { user, onSubmit } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    fireEvent.change(screen.getByLabelText(/preferred start time/i), {
      target: {
        value: '19:30',
      },
    })

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSubmit).toHaveBeenCalledWith(19, 30)
  })

  it('should render the delete schedule button when enabled', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(
      screen.getByRole('button', {
        name: /delete schedule/i,
      }),
    ).toBeInTheDocument()
  })

  it('should hide the delete schedule button when disabled', async () => {
    const { user } = renderComponent({
      allowDeleteSchedule: false,
    })

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(
      screen.queryByRole('button', {
        name: /delete schedule/i,
      }),
    ).not.toBeInTheDocument()
  })

  it('should call onDeleteSchedule', async () => {
    const { user, onDeleteSchedule } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    await user.click(
      screen.getByRole('button', {
        name: /delete schedule/i,
      }),
    )

    expect(onDeleteSchedule).toHaveBeenCalled()
  })

  it('should render the calculated schedule preview', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByText(/ends at/i)).toBeInTheDocument()
    expect(screen.getByText('5:30 PM')).toBeInTheDocument()
    expect(screen.getByText(/the next day/i)).toBeInTheDocument()
  })

  it('should call onOpenChange in controlled mode', async () => {
    const { user, onOpenChange } = renderComponent({
      open: false,
    })

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(onOpenChange).toHaveBeenCalledWith(true)
  })
})
