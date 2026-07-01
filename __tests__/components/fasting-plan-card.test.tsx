import FastingPlanCard from '@/components/fasting-plan-card'
import { fastingPlans } from '@/constants/fasting-plans'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import PreferredFastTimeDialog from '@/components/preferred-fast-time-dialog'

jest.mock('sonner')
jest.mock('@/lib/fasting', () => ({
  formatPreferredTime: jest.fn(() => '6:00 PM'),
  getPreferredFastSchedule: jest.fn(() => ({
    startsAt: {
      hour: 18,
      minute: 0,
    },
    endsAt: {
      hour: 10,
      minute: 0,
    },
    endsNextDay: true,
  })),
}))

type PreferredFastTimeDialogProps = React.ComponentProps<
  typeof PreferredFastTimeDialog
>

jest.mock('@/components/preferred-fast-time-dialog', () => {
  return function MockPreferredFastTimeDialog(
    props: PreferredFastTimeDialogProps,
  ) {
    return (
      <div data-testid='preferred-fast-time-dialog'>
        {props.children}

        <button onClick={() => props.onSubmit(18, 0)}>
          Submit preferred time
        </button>

        <button onClick={() => props.onDeleteSchedule?.()}>
          Delete preferred time
        </button>
      </div>
    )
  }
})

const mockUpdatePlanId = jest.fn()
const mockUpdatePreferredFastStartTime = jest.fn()
const mockClearPreferredFastStartTime = jest.fn()

const renderFastingPlanCard = (props = {}) =>
  render(
    <FastingPlanCard
      isLoading={false}
      planId='16:8'
      preferredFastStartTime={null}
      updatePlanId={mockUpdatePlanId}
      updatePreferredFastStartTime={mockUpdatePreferredFastStartTime}
      clearPreferredFastStartTime={mockClearPreferredFastStartTime}
      {...props}
    />,
  )

describe('Fasting plan card', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the loading skeleton', () => {
    renderFastingPlanCard({
      isLoading: true,
    })

    expect(screen.getByText(/fasting plan/i)).toBeInTheDocument()
    expect(screen.queryByText('16:8')).not.toBeInTheDocument()
  })

  it('should render the fasting plan heading', () => {
    renderFastingPlanCard()
    expect(screen.getByText('Fasting plan')).toBeInTheDocument()
  })

  it('should prompt the user to select a fasting plan', () => {
    renderFastingPlanCard({
      planId: null,
    })

    expect(
      screen.getByText(/haven't selected a fasting plan/i),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /select plan/i,
      }),
    ).toBeInTheDocument()
  })

  it('should render an edit button', () => {
    renderFastingPlanCard()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })

  it('should render the fasting plan title and description', () => {
    renderFastingPlanCard()
    expect(screen.getByText('16:8')).toBeInTheDocument()
    expect(
      screen.getByText('16 hours fasting with 8 hours eating window.'),
    ).toBeInTheDocument()
  })

  it('should open the dialog when edit button is clicked', async () => {
    renderFastingPlanCard()

    const button = screen.getByRole('button', { name: /edit/i })
    const user = userEvent.setup()
    await user.click(button)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should display all the fasting plans in the dialog', async () => {
    renderFastingPlanCard()

    const button = screen.getByRole('button', { name: /edit/i })
    const user = userEvent.setup()
    await user.click(button)
    const dialog = screen.getByRole('dialog')

    fastingPlans.forEach((plan) => {
      expect(within(dialog).getByText(plan.title)).toBeInTheDocument()
    })

    expect(within(dialog).getAllByRole('radio')).toHaveLength(
      fastingPlans.length,
    )
  })

  it('should disable save button on dialog by default', async () => {
    renderFastingPlanCard()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /edit/i }))

    const dialog = screen.getByRole('dialog')
    const saveButton = within(dialog).getByRole('button', { name: /save/i })

    expect(saveButton).toBeInTheDocument()
    expect(saveButton).toBeDisabled()
  })

  it('should enable save when a different plan is selected', async () => {
    renderFastingPlanCard()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /edit/i }))

    const dialog = screen.getByRole('dialog')
    const saveButton = within(dialog).getByRole('button', { name: /save/i })

    await user.click(within(dialog).getByText('20:4'))
    expect(saveButton).toBeEnabled()
  })

  it('should call setPlan when save is clicked', async () => {
    renderFastingPlanCard()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /edit/i }))

    const dialog = screen.getByRole('dialog')
    const saveButton = within(dialog).getByRole('button', { name: /save/i })

    await user.click(within(dialog).getByText('20:4'))
    await user.click(saveButton)

    expect(mockUpdatePlanId).toHaveBeenCalledWith('20:4')
  })

  it('should close the dialog after saving', async () => {
    renderFastingPlanCard()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /edit/i }))

    const dialog = screen.getByRole('dialog')
    const saveButton = within(dialog).getByRole('button', { name: /save/i })

    await user.click(within(dialog).getByText('20:4'))
    await user.click(saveButton)

    expect(dialog).not.toBeInTheDocument()
  })

  it('should reset draft plan when dialog is reopened', async () => {
    renderFastingPlanCard()

    const user = userEvent.setup()
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    const dialog = screen.getByRole('dialog')

    expect(
      within(dialog).getByRole('radio', {
        checked: true,
      }),
    ).toHaveValue('16:8')

    await user.click(within(dialog).getByText('20:4'))

    expect(
      within(dialog).getByRole('radio', {
        checked: true,
      }),
    ).toHaveValue('20:4')

    await user.keyboard('{Escape}') // close dialog
    await user.click(editButton)

    const reopenedDialog = screen.getByRole('dialog')
    expect(
      within(reopenedDialog).getByRole('radio', {
        checked: true,
      }),
    ).toHaveValue('16:8')
  })

  it('should show a success toast after saving a new plan', async () => {
    renderFastingPlanCard()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /edit/i }))

    const dialog = screen.getByRole('dialog')

    await user.click(within(dialog).getByText('20:4'))
    await user.click(within(dialog).getByRole('button', { name: /save/i }))

    expect(toast.success).toHaveBeenCalledWith('Fasting plan updated')
  })

  it('should render the preferred fasting schedule', () => {
    renderFastingPlanCard({
      preferredFastStartTime: {
        hour: 18,
        minute: 0,
      },
    })

    expect(screen.getByText('Preferred schedule')).toBeInTheDocument()
    expect(screen.getByText('Fasting starts')).toBeInTheDocument()
    expect(screen.getByText('Eating starts')).toBeInTheDocument()
    expect(screen.getAllByText('6:00 PM')).toHaveLength(2)
    expect(screen.getByText('next day')).toBeInTheDocument()
  })

  it('should prompt the user to set a preferred schedule', () => {
    renderFastingPlanCard()

    expect(
      screen.getByText(/set your preferred fasting start time/i),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /set time/i,
      }),
    ).toBeInTheDocument()
  })

  it('should require a fasting plan before setting a preferred schedule', () => {
    renderFastingPlanCard({
      planId: null,
    })

    expect(screen.getByText(/fasting plan is needed/i)).toBeInTheDocument()
  })

  it('should update the preferred fasting schedule', async () => {
    renderFastingPlanCard({
      preferredFastStartTime: {
        hour: 18,
        minute: 0,
      },
    })

    const user = userEvent.setup()

    await user.click(
      screen.getByRole('button', {
        name: /submit preferred time/i,
      }),
    )

    expect(mockUpdatePreferredFastStartTime).toHaveBeenCalledWith(18, 0)
    expect(toast.success).toHaveBeenCalledWith('Fasting schedule updated')
  })

  it('should create a preferred fasting schedule', async () => {
    renderFastingPlanCard()

    const user = userEvent.setup()

    await user.click(
      screen.getByRole('button', {
        name: /submit preferred time/i,
      }),
    )

    expect(mockUpdatePreferredFastStartTime).toHaveBeenCalledWith(18, 0)
    expect(toast.success).toHaveBeenCalledWith('Fasting schedule set')
  })

  it('should delete the preferred fasting schedule', async () => {
    renderFastingPlanCard({
      preferredFastStartTime: {
        hour: 18,
        minute: 0,
      },
    })

    const user = userEvent.setup()

    await user.click(
      screen.getByRole('button', {
        name: /delete preferred time/i,
      }),
    )

    expect(mockClearPreferredFastStartTime).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith('Fasting schedule deleted')
  })

  it('should not show next day when the eating window starts on the same day', () => {
    const { getPreferredFastSchedule } = jest.requireMock('@/lib/fasting')

    getPreferredFastSchedule.mockReturnValue({
      startsAt: {
        hour: 6,
        minute: 0,
      },
      endsAt: {
        hour: 14,
        minute: 0,
      },
      endsNextDay: false,
    })

    renderFastingPlanCard({
      preferredFastStartTime: {
        hour: 6,
        minute: 0,
      },
    })

    expect(screen.queryByText('next day')).not.toBeInTheDocument()
  })
})
