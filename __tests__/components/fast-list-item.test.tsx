import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { format } from 'date-fns'
import FastListItem from '@/components/fast-list-item'
import FastDialog from '@/components/fast-dialog'

jest.mock('@/components/fast-dialog', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid='fast-dialog' />),
}))

const mockFast = {
  id: 'fast-1',
  startedAt: '2026-01-01T10:00:00.000Z',
  endedAt: '2026-01-01T18:00:00.000Z',
}

const fasts = [
  mockFast,
  {
    id: 'fast-2',
    startedAt: '2026-01-02T10:00:00.000Z',
    endedAt: '2026-01-02T18:00:00.000Z',
  },
]

const onDeleteMock = jest.fn()
const onUpdateMock = jest.fn()

const renderComponent = () => {
  render(
    <FastListItem
      fast={mockFast}
      fasts={fasts}
      onDelete={onDeleteMock}
      onUpdate={onUpdateMock}
    />,
  )
}

describe('FastListItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the fast duration', () => {
    renderComponent()

    expect(screen.getByText('08:00:00')).toBeInTheDocument()
    expect(screen.getByText(/duration/i)).toBeInTheDocument()
  })

  it('should render the started timestamp', () => {
    renderComponent()

    expect(screen.getByText(/started/i)).toBeInTheDocument()
    expect(
      screen.getByText(format(new Date(mockFast.startedAt), 'EEE, PPP p')),
    ).toBeInTheDocument()
  })

  it('should render the ended timestamp', () => {
    renderComponent()

    expect(screen.getByText(/ended/i)).toBeInTheDocument()
    expect(
      screen.getByText(format(new Date(mockFast.endedAt), 'EEE, PPP p')),
    ).toBeInTheDocument()
  })

  it('should render the delete button', () => {
    renderComponent()

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('should open the delete confirmation dialog', async () => {
    const user = userEvent.setup()

    renderComponent()

    await user.click(screen.getByRole('button', { name: /^delete$/i }))

    expect(
      screen.getByRole('heading', {
        name: /delete fast/i,
      }),
    ).toBeInTheDocument()
  })

  it('should call onDelete when deletion is confirmed', async () => {
    const user = userEvent.setup()

    renderComponent()

    await user.click(screen.getByRole('button', { name: /^delete$/i }))

    await user.click(
      within(screen.getByRole('alertdialog')).getByRole('button', {
        name: /^delete$/i,
      }),
    )

    expect(onDeleteMock).toHaveBeenCalledTimes(1)
  })

  it('should pass the correct props to FastDialog', () => {
    renderComponent()

    expect(FastDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        dialogTitle: 'Edit past fast',
        submitLabel: 'Edit fast',
        triggerTitle: 'Edit',
        initialStartedAt: new Date(mockFast.startedAt),
        initialEndedAt: new Date(mockFast.endedAt),
        existingFasts: [fasts[1]],
      }),
      undefined,
    )
  })
})
