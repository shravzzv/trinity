import FastingPlanCard from '@/components/fasting-plan-card'
import { fastingPlans } from '@/constants/fasting-plans'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'

const mockUpdatePlanId = jest.fn()

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}))

const renderFastingPlanCard = (props = {}) => {
  return render(
    <FastingPlanCard
      planId='16:8'
      updatePlanId={mockUpdatePlanId}
      {...props}
    />,
  )
}

describe('Fasting plan card', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the fasting plan heading', () => {
    renderFastingPlanCard()
    expect(screen.getByText('Fasting plan')).toBeInTheDocument()
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

  it('should fall back to the first plan when an unknown plan is provided', () => {
    renderFastingPlanCard({
      plan: 'invalid-plan',
    })

    expect(screen.getByText('16:8')).toBeInTheDocument()
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
})
