import DateTimeField from '@/components/date-time-field'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('@/components/ui/calendar', () => ({
  Calendar: ({ onSelect }: { onSelect: (date: Date) => void }) => (
    <button
      type='button'
      onClick={() => onSelect(new Date('2026-07-05T00:00:00'))}
    >
      Select date
    </button>
  ),
}))

const onChangeMock = jest.fn()
const value = new Date('2026-07-04T09:30:00')

const renderComponent = (
  props: Partial<React.ComponentProps<typeof DateTimeField>> = {},
) => {
  const user = userEvent.setup()

  render(
    <DateTimeField
      value={value}
      label='Started'
      onChange={onChangeMock}
      {...props}
    />,
  )

  return { user }
}

describe('DateTimeField', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the date field', () => {
    renderComponent()

    expect(screen.getByLabelText(/started date/i)).toBeInTheDocument()
  })

  it('renders the time field', () => {
    renderComponent()

    expect(screen.getByLabelText(/started time/i)).toBeInTheDocument()
  })

  it('renders the formatted date', () => {
    renderComponent()

    expect(
      screen.getByRole('button', {
        name: /started date/i,
      }),
    ).toHaveTextContent('Jul 4, 2026')
  })

  it('renders the formatted time', () => {
    renderComponent()

    expect(screen.getByDisplayValue('09:30')).toBeInTheDocument()
  })

  it('autofocuses the time input when requested', () => {
    renderComponent({
      autoFocus: true,
    })

    expect(screen.getByLabelText(/started time/i)).toHaveFocus()
  })

  it('calls onChange when the time changes', async () => {
    const { user } = renderComponent()

    const input = screen.getByLabelText(/started time/i) as HTMLInputElement

    await user.clear(input)
    await user.type(input, '12:45')

    expect(onChangeMock).toHaveBeenCalled()
  })

  it('opens the calendar popover when the date button is clicked', async () => {
    const { user } = renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: /started date/i,
      }),
    )

    expect(screen.getByText('Select date')).toBeInTheDocument()
  })

  it('preserves the existing time when a new date is selected', async () => {
    const { user } = renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: /started date/i,
      }),
    )

    await user.click(screen.getByText('Select date'))

    expect(onChangeMock).toHaveBeenCalledWith(new Date('2026-07-05T09:30:00'))
  })

  it('renders when future dates are disabled', () => {
    renderComponent({
      disableFutureDates: true,
    })

    expect(
      screen.getByRole('button', {
        name: /started date/i,
      }),
    ).toBeInTheDocument()
  })
})
