import InactiveFastingTimer from '@/components/inactive-fasting-timer'
import FastingPlanDialog from '@/components/fasting-plan-dialog'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { FastingPlanId } from '@/types/fasting'
import * as fasting from '@/lib/fasting'

jest.mock('@/components/fasting-plan-dialog', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <>{children}</>),
}))

jest.mock('@/lib/fasting', () => ({
  getInitialSessionStartedAt: jest.fn(),
}))

const startFastingMock = jest.fn()
const updatePlanIdMock = jest.fn()
const mockAwardXp = jest.fn()

const renderComponent = ({
  planId = '16:8' as FastingPlanId | null,
  preferredFastStartTime = null,
} = {}) => {
  const user = userEvent.setup()

  render(
    <InactiveFastingTimer
      planId={planId}
      awardXp={mockAwardXp}
      startFasting={startFastingMock}
      updatePlanId={updatePlanIdMock}
      preferredFastStartTime={preferredFastStartTime}
    />,
  )

  return { user }
}

describe('InactiveFastingTimer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(fasting.getInitialSessionStartedAt).mockReturnValue(null)
  })

  it('renders the title', () => {
    renderComponent()

    expect(screen.getByText('Fasting timer')).toBeInTheDocument()
  })

  describe('when a fasting plan has been selected', () => {
    it('renders the inactive session message', () => {
      renderComponent()

      expect(screen.getByText('No active fasting session.')).toBeInTheDocument()
    })

    it('renders the start fasting button', () => {
      renderComponent()

      expect(
        screen.getByRole('button', {
          name: /start fasting/i,
        }),
      ).toBeInTheDocument()
    })

    it('calls startFasting when the button is clicked', async () => {
      const { user } = renderComponent()

      await user.click(
        screen.getByRole('button', {
          name: /start fasting/i,
        }),
      )

      expect(startFastingMock).toHaveBeenCalledTimes(1)
    })

    it('calls startFasting with the preferred start time when the button is clicked', async () => {
      const startedAt = new Date('2026-07-04T18:00:00')

      jest.mocked(fasting.getInitialSessionStartedAt).mockReturnValue(startedAt)

      const { user } = renderComponent()

      await user.click(
        screen.getByRole('button', {
          name: /start fasting/i,
        }),
      )

      expect(startFastingMock).toHaveBeenCalledWith(startedAt)
    })

    it('calls startFasting with undefined when no preferred start time exists', async () => {
      jest.mocked(fasting.getInitialSessionStartedAt).mockReturnValue(null)

      const { user } = renderComponent()

      await user.click(
        screen.getByRole('button', {
          name: /start fasting/i,
        }),
      )

      expect(startFastingMock).toHaveBeenCalledWith(undefined)
    })

    it('does not render the fasting plan dialog', () => {
      renderComponent()

      expect(FastingPlanDialog).not.toHaveBeenCalled()
    })
  })

  describe('when no fasting plan has been selected', () => {
    it('renders the onboarding message', () => {
      renderComponent({
        planId: null,
      })
      expect(
        screen.getByText(
          'You need to select a fasting plan in order to get started.',
        ),
      ).toBeInTheDocument()
    })

    it('renders the select plan button', () => {
      renderComponent({
        planId: null,
      })
      expect(
        screen.getByRole('button', {
          name: /select plan/i,
        }),
      ).toBeInTheDocument()
    })

    it('renders the fasting plan dialog', () => {
      renderComponent({
        planId: null,
      })
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
      renderComponent({
        planId: null,
      })
      expect(
        screen.queryByRole('button', {
          name: /start fasting/i,
        }),
      ).not.toBeInTheDocument()
    })
  })
})
