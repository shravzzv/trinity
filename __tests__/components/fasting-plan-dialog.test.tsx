import FastingPlanDialog from '@/components/fasting-plan-dialog'
import { fastingPlans } from '@/constants/fasting-plans'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const renderComponent = (
  props: Partial<React.ComponentProps<typeof FastingPlanDialog>> = {},
) => {
  const onSubmit = jest.fn()
  const onOpenChange = jest.fn()

  render(
    <FastingPlanDialog
      dialogTitle='Select your fasting plan'
      dialogDescription='Choose a plan.'
      selectedPlanId={null}
      onSubmit={onSubmit}
      {...props}
    >
      <button type='button'>Open</button>
    </FastingPlanDialog>,
  )

  return {
    onSubmit,
    onOpenChange,
    user: userEvent.setup(),
  }
}

describe('FastingPlanDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the trigger', () => {
    renderComponent()

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('opens when the trigger is clicked', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(
      screen.getByRole('heading', {
        name: 'Select your fasting plan',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Choose a plan.')).toBeInTheDocument()
  })

  it('renders every fasting plan', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    for (const plan of fastingPlans) {
      expect(screen.getByText(plan.title)).toBeInTheDocument()
    }
  })

  it('starts with no plan selected by default', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('selects the provided plan initially', async () => {
    const { user } = renderComponent({
      selectedPlanId: '18:6',
    })

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(
      screen.getByRole('radio', {
        name: /^18:6/,
      }),
    ).toBeChecked()
  })

  it('enables save after selecting a different plan', async () => {
    const { user } = renderComponent({
      selectedPlanId: '16:8',
    })

    await user.click(screen.getByRole('button', { name: 'Open' }))

    await user.click(
      screen.getByRole('radio', {
        name: /^18:6/,
      }),
    )

    expect(
      screen.getByRole('button', {
        name: 'Save',
      }),
    ).toBeEnabled()
  })

  it('keeps save disabled when nothing changed', async () => {
    const { user } = renderComponent({
      selectedPlanId: '16:8',
    })

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(
      screen.getByRole('button', {
        name: 'Save',
      }),
    ).toBeDisabled()
  })

  it('calls onSubmit with the selected plan', async () => {
    const { user, onSubmit } = renderComponent({
      selectedPlanId: '16:8',
    })

    await user.click(screen.getByRole('button', { name: 'Open' }))

    await user.click(
      screen.getByRole('radio', {
        name: /^20:4/,
      }),
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Save',
      }),
    )

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith('20:4')
  })

  it('closes after saving', async () => {
    const { user } = renderComponent({
      selectedPlanId: '16:8',
    })

    await user.click(screen.getByRole('button', { name: 'Open' }))

    await user.click(
      screen.getByRole('radio', {
        name: /^18:6/,
      }),
    )

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(
      screen.queryByRole('heading', {
        name: 'Select your fasting plan',
      }),
    ).not.toBeInTheDocument()
  })

  it('resets the selected plan when reopened', async () => {
    const { user } = renderComponent({
      selectedPlanId: '16:8',
      allowClose: true,
    })

    await user.click(screen.getByRole('button', { name: 'Open' }))

    await user.click(
      screen.getByRole('radio', {
        name: /^18:6/,
      }),
    )

    const dialog = screen.getByRole('dialog')

    const closeButton = within(dialog)
      .getAllByRole('button', {
        name: /^close$/i,
      })
      .at(-1)!

    await user.click(closeButton)

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(
      screen.getByRole('radio', {
        name: /^16:8/,
      }),
    ).toBeChecked()
  })

  it('renders the close button when allowClose is true', async () => {
    const { user } = renderComponent({
      allowClose: true,
    })

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(
      screen
        .getAllByRole('button', {
          name: /^close$/i,
        })
        .at(-1),
    ).toBeInTheDocument()
  })

  it('does not render the close button by default', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(
      screen.queryByRole('button', {
        name: /^close$/i,
      }),
    ).not.toBeInTheDocument()
  })

  it('supports controlled mode', async () => {
    const onOpenChange = jest.fn()

    render(
      <FastingPlanDialog
        dialogTitle='Select your fasting plan'
        dialogDescription='Choose a plan.'
        selectedPlanId={null}
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={jest.fn()}
        allowClose
      />,
    )

    const dialog = screen.getByRole('dialog')

    const closeButton = within(dialog)
      .getAllByRole('button', {
        name: /^close$/i,
      })
      .at(0)!

    await userEvent.setup().click(closeButton)

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('falls back to uncontrolled mode when only open is provided', () => {
    render(
      <FastingPlanDialog
        dialogTitle='Title'
        dialogDescription='Description'
        selectedPlanId={null}
        open={true}
        onSubmit={jest.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onOpenChange when the dialog requests to close', async () => {
    const user = userEvent.setup()
    const onOpenChange = jest.fn()

    render(
      <FastingPlanDialog
        dialogTitle='Select your fasting plan'
        dialogDescription='Choose a plan.'
        selectedPlanId={null}
        open
        allowClose
        onOpenChange={onOpenChange}
        onSubmit={jest.fn()}
      />,
    )

    await user.click(
      screen.getAllByRole('button', {
        name: /^close$/i,
      })[0], // footer close
    )

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
