import InactiveFastingTimer from '@/components/inactive-fasting-timer'
import FastingPlanDialog from '@/components/fasting-plan-dialog'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('@/components/fasting-plan-dialog', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <>{children}</>),
}))

const startFastingMock = jest.fn()
const updatePlanIdMock = jest.fn()

const renderComponent = (hasPlan = true) => {
  const user = userEvent.setup()

  render(
    <InactiveFastingTimer
      hasPlan={hasPlan}
      startFasting={startFastingMock}
      updatePlanId={updatePlanIdMock}
    />,
  )

  return { user }
}

describe('InactiveFastingTimer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the title', () => {
    renderComponent()

    expect(screen.getByText('Fasting timer')).toBeInTheDocument()
  })

  describe('when a fasting plan has been selected', () => {
    it('renders the inactive session message', () => {
      renderComponent(true)

      expect(screen.getByText('No active fasting session.')).toBeInTheDocument()
    })

    it('renders the start fasting button', () => {
      renderComponent(true)

      expect(
        screen.getByRole('button', {
          name: /start fasting/i,
        }),
      ).toBeInTheDocument()
    })

    it('calls startFasting when the button is clicked', async () => {
      const { user } = renderComponent(true)

      await user.click(
        screen.getByRole('button', {
          name: /start fasting/i,
        }),
      )

      expect(startFastingMock).toHaveBeenCalledTimes(1)
    })

    it('does not render the fasting plan dialog', () => {
      renderComponent(true)

      expect(FastingPlanDialog).not.toHaveBeenCalled()
    })
  })

  describe('when no fasting plan has been selected', () => {
    it('renders the onboarding message', () => {
      renderComponent(false)

      expect(
        screen.getByText(
          'You need to select a fasting plan in order to get started.',
        ),
      ).toBeInTheDocument()
    })

    it('renders the select plan button', () => {
      renderComponent(false)

      expect(
        screen.getByRole('button', {
          name: /select plan/i,
        }),
      ).toBeInTheDocument()
    })

    it('renders the fasting plan dialog', () => {
      renderComponent(false)

      expect(FastingPlanDialog).toHaveBeenCalledWith(
        expect.objectContaining({
          dialogTitle: 'Select your fasting plan',
          dialogDescription: expect.any(String),
          selectedPlanId: null,
          onSubmit: expect.any(Function),
        }),
        undefined,
      )
    })

    it('does not render the start fasting button', () => {
      renderComponent(false)

      expect(
        screen.queryByRole('button', {
          name: /start fasting/i,
        }),
      ).not.toBeInTheDocument()
    })
  })
})
