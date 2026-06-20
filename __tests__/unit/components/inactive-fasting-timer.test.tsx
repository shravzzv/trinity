import InactiveFastingTimer from '@/components/inactive-fasting-timer'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const startFastingMock = jest.fn()

const renderInactiveFastingTimer = () => {
  return render(<InactiveFastingTimer startFasting={startFastingMock} />)
}

describe('Inactive fasting timer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the title "Fasting timer"', () => {
    renderInactiveFastingTimer()
    expect(screen.getByText('Fasting timer')).toBeInTheDocument()
  })

  it('should render the message about no active fasting session', () => {
    renderInactiveFastingTimer()
    expect(screen.getByText('No active fasting session.')).toBeInTheDocument()
  })

  it('should render a button for starting fast', () => {
    renderInactiveFastingTimer()
    expect(
      screen.getByRole('button', { name: /start fasting/i }),
    ).toBeInTheDocument()
  })

  it('should call `startFasting` when the button is clicked', async () => {
    renderInactiveFastingTimer()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /start fasting/i }))
    expect(startFastingMock).toHaveBeenCalledTimes(1)
  })
})
