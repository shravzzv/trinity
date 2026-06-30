import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import TargetWeightCard from '@/components/target-weight-card'
import { toast } from 'sonner'

jest.mock('sonner')

const update = jest.fn()

const renderComponent = (
  props: Partial<React.ComponentProps<typeof TargetWeightCard>> = {},
) => {
  render(
    <TargetWeightCard
      targetWeight={null}
      update={update}
      isLoading={false}
      {...props}
    />,
  )
}

const openDialog = async (
  user: ReturnType<typeof userEvent.setup>,
  buttonName: RegExp = /set target|edit/i,
) => {
  await user.click(
    screen.getByRole('button', {
      name: buttonName,
    }),
  )
}

describe('TargetWeightCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders empty state when no target weight exists', () => {
    renderComponent()

    expect(screen.getByText('Weight target')).toBeInTheDocument()
    expect(
      screen.getByText(/haven't set a target weight yet/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /set target/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders the current target weight', () => {
    renderComponent({
      targetWeight: 58,
    })

    expect(screen.getByText('58.0 kg')).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /edit/i,
      }),
    ).toBeInTheDocument()
  })

  it('opens the dialog', async () => {
    const user = userEvent.setup()

    renderComponent()

    await openDialog(user)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByRole('spinbutton', {
        name: /^weight$/i,
      }),
    ).toBeInTheDocument()
  })

  it('prefills the input with the existing target weight', async () => {
    const user = userEvent.setup()

    renderComponent({
      targetWeight: 58,
    })

    await openDialog(user)

    expect(
      screen.getByRole('spinbutton', {
        name: /^weight$/i,
      }),
    ).toHaveValue(58)
  })

  it('disables save when nothing changed', async () => {
    const user = userEvent.setup()

    renderComponent({
      targetWeight: 58,
    })

    await openDialog(user)

    expect(
      screen.getByRole('button', {
        name: /^save$/i,
      }),
    ).toBeDisabled()
  })

  it('shows validation message for invalid weight', async () => {
    const user = userEvent.setup()

    renderComponent()

    await openDialog(user)

    const input = screen.getByRole('spinbutton', {
      name: /^weight$/i,
    })

    await user.type(input, '1')

    expect(screen.getByText(/weight must be between/i)).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('enables save for a valid weight', async () => {
    const user = userEvent.setup()

    renderComponent()

    await openDialog(user)

    await user.type(
      screen.getByRole('spinbutton', {
        name: /^weight$/i,
      }),
      '58',
    )

    expect(
      screen.getByRole('button', {
        name: /^save$/i,
      }),
    ).toBeEnabled()
  })

  it('updates the target weight', async () => {
    const user = userEvent.setup()

    renderComponent()

    await openDialog(user)

    await user.type(
      screen.getByRole('spinbutton', {
        name: /^weight$/i,
      }),
      '58',
    )

    await user.click(
      screen.getByRole('button', {
        name: /^save$/i,
      }),
    )

    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith(58)
    expect(toast.success).toHaveBeenCalledWith('Target weight set')
  })

  it('shows update toast when editing', async () => {
    const user = userEvent.setup()

    renderComponent({
      targetWeight: 60,
    })

    await openDialog(user)

    const input = screen.getByRole('spinbutton', {
      name: /^weight$/i,
    })

    await user.clear(input)
    await user.type(input, '58')

    await user.click(
      screen.getByRole('button', {
        name: /^save$/i,
      }),
    )

    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith(58)
    expect(toast.success).toHaveBeenCalledWith('Target weight updated')
  })

  it('submits when Enter is pressed', async () => {
    const user = userEvent.setup()

    renderComponent()

    await openDialog(user)

    const input = screen.getByRole('spinbutton', {
      name: /^weight$/i,
    })

    await user.type(input, '58{Enter}')

    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith(58)
    expect(toast.success).toHaveBeenCalledWith('Target weight set')
  })

  it('does not submit invalid values when Enter is pressed', async () => {
    const user = userEvent.setup()

    renderComponent()

    await openDialog(user)

    const input = screen.getByRole('spinbutton', {
      name: /^weight$/i,
    })

    await user.type(input, '1{Enter}')

    expect(update).not.toHaveBeenCalled()
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('does not save when the value is unchanged', async () => {
    const user = userEvent.setup()

    renderComponent({
      targetWeight: 58,
    })

    await openDialog(user)

    await user.type(
      screen.getByRole('spinbutton', {
        name: /^weight$/i,
      }),
      '{Enter}',
    )

    expect(update).not.toHaveBeenCalled()
  })

  it('resets the input when the dialog is closed', async () => {
    const user = userEvent.setup()

    renderComponent({
      targetWeight: 58,
    })

    await openDialog(user)

    const input = screen.getByRole('spinbutton', {
      name: /^weight$/i,
    })
    const closeButtons = screen.getAllByRole('button', {
      name: /^close$/i,
    })

    await user.clear(input)
    await user.type(input, '65')
    await user.click(closeButtons.at(-1)!)

    await openDialog(user)

    expect(
      screen.getByRole('spinbutton', {
        name: /^weight$/i,
      }),
    ).toHaveValue(58)
  })

  it('clears the input when reopening after creating a target', async () => {
    const user = userEvent.setup()

    renderComponent()

    await openDialog(user)

    const closeButtons = screen.getAllByRole('button', {
      name: /^close$/i,
    })

    await user.type(
      screen.getByRole('spinbutton', {
        name: /^weight$/i,
      }),
      '58',
    )
    await user.click(closeButtons.at(-1)!)

    await openDialog(user)

    expect(
      screen.getByRole('spinbutton', {
        name: /^weight$/i,
      }),
    ).toHaveValue(null)
  })
})
