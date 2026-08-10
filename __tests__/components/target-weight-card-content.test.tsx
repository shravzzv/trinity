import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { toast } from 'sonner'
import TargetWeightCardContent from '@/components/target-weight-card-content'
import { useWeightContext } from '@/providers/weight-provider'
import { useGamificationContext } from '@/providers/gamification-provider'

jest.mock('sonner')

jest.mock('@/providers/weight-provider', () => ({
  useWeightContext: jest.fn(),
}))

jest.mock('@/providers/gamification-provider', () => ({
  useGamificationContext: jest.fn(),
}))

const mockUseWeightContext = jest.mocked(useWeightContext)
const mockUseGamificationContext = jest.mocked(useGamificationContext)

const updateTargetWeight = jest.fn()
const clearTargetWeight = jest.fn()
const awardXp = jest.fn()

const renderComponent = (targetWeightKg: number | null = null) => {
  mockUseWeightContext.mockReturnValue({
    targetWeightKg,
    updateTargetWeight,
    clearTargetWeight,
    // The component only uses these three values from the context.
    entries: [],
    addWeightEntry: jest.fn(),
    deleteWeightEntry: jest.fn(),
    updateWeightEntry: jest.fn(),
    isLoading: false,
  })

  mockUseGamificationContext.mockReturnValue({
    awardXp,
    // The component only uses awardXp from this context.
    xp: 0,
    streak: 0,
    anchors: 0,
    isLoading: false,
    awardAnchor: jest.fn(),
    spendAnchor: jest.fn(),
    incrementStreak: jest.fn(),
    resetStreak: jest.fn(),
    currentAchievement: null,
    dismissAchievement: jest.fn(),
  })

  render(<TargetWeightCardContent />)
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

describe('TargetWeightCardContent', () => {
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
    renderComponent(58)

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

    renderComponent(58)

    await openDialog(user)

    expect(
      screen.getByRole('spinbutton', {
        name: /^weight$/i,
      }),
    ).toHaveValue(58)
  })

  it('disables save when nothing changed', async () => {
    const user = userEvent.setup()

    renderComponent(58)

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

    expect(updateTargetWeight).toHaveBeenCalledTimes(1)
    expect(updateTargetWeight).toHaveBeenCalledWith(58)
    expect(awardXp).toHaveBeenCalledTimes(1)
    expect(toast.success).toHaveBeenCalledWith('Target weight set')
  })

  it('shows update toast when editing', async () => {
    const user = userEvent.setup()

    renderComponent(60)

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

    expect(updateTargetWeight).toHaveBeenCalledTimes(1)
    expect(updateTargetWeight).toHaveBeenCalledWith(58)
    expect(awardXp).toHaveBeenCalledTimes(1)
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

    expect(updateTargetWeight).toHaveBeenCalledTimes(1)
    expect(updateTargetWeight).toHaveBeenCalledWith(58)
    expect(awardXp).toHaveBeenCalledTimes(1)
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

    expect(updateTargetWeight).not.toHaveBeenCalled()
    expect(awardXp).not.toHaveBeenCalled()
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('does not save when the value is unchanged', async () => {
    const user = userEvent.setup()

    renderComponent(58)

    await openDialog(user)

    await user.type(
      screen.getByRole('spinbutton', {
        name: /^weight$/i,
      }),
      '{Enter}',
    )

    expect(updateTargetWeight).not.toHaveBeenCalled()
    expect(awardXp).not.toHaveBeenCalled()
  })

  it('resets the input when the dialog is closed', async () => {
    const user = userEvent.setup()

    renderComponent(58)

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

  it('clears the target weight', async () => {
    const user = userEvent.setup()

    renderComponent(58)

    await openDialog(user)

    await user.click(
      screen.getByRole('button', {
        name: /delete target weight/i,
      }),
    )

    expect(clearTargetWeight).toHaveBeenCalledTimes(1)
    expect(toast.success).toHaveBeenCalledWith('Target weight deleted')
  })
})
