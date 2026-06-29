import WeightStatistics from '@/components/weight-statistics'
import { WEIGHT_STATISTICS_CADENCE_STORAGE_KEY } from '@/constants/storage-keys'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'

jest.mock('sonner')

jest.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children }: React.PropsWithChildren) => (
    <div data-testid='chart-container'>{children}</div>
  ),
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}))

jest.mock('recharts', () => ({
  AreaChart: ({ children }: React.PropsWithChildren) => (
    <div data-testid='area-chart'>{children}</div>
  ),
  Area: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  CartesianGrid: () => null,
  LabelList: () => null,
  XAxis: () => null,
}))

jest.mock('@/components/weight-dialog', () => ({
  __esModule: true,
  default: ({
    onSave,
    children,
  }: {
    onSave: (weightKg: number, recordedAt: Date) => void
    children: React.ReactNode
  }) => (
    <div>
      {children}

      <button
        type='button'
        onClick={() => onSave(72.5, new Date('2026-01-15T12:00:00.000Z'))}
      >
        Mock Save Weight
      </button>
    </div>
  ),
}))

jest.mock('@/components/edit-weights-sheet', () => ({
  __esModule: true,
  default: ({ weightEntries }: { weightEntries: unknown[] }) => (
    <div data-testid='edit-weights-sheet'>{weightEntries.length}</div>
  ),
}))

const entries = [
  {
    id: '1',
    weightKg: 80,
    recordedAt: new Date('2026-01-10T12:00:00Z').toISOString(),
  },
  {
    id: '2',
    weightKg: 78,
    recordedAt: new Date('2026-01-15T12:00:00Z').toISOString(),
  },
]

const renderComponent = (
  props: Partial<React.ComponentProps<typeof WeightStatistics>> = {},
) => {
  const addWeight = jest.fn()
  const updateWeight = jest.fn()
  const deleteWeight = jest.fn()

  render(
    <WeightStatistics
      isLoading={false}
      entries={entries}
      targetWeight={75}
      addWeight={addWeight}
      updateWeight={updateWeight}
      deleteWeight={deleteWeight}
      {...props}
    />,
  )

  return {
    user: userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    }),
    addWeight,
    updateWeight,
    deleteWeight,
  }
}

describe('WeightStatistics', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-15T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the title', () => {
    renderComponent()

    expect(screen.getByText(/weight statistics/i)).toBeInTheDocument()
  })

  it('renders the chart container', () => {
    renderComponent()

    expect(screen.getByTestId('chart-container')).toBeInTheDocument()
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })

  it('renders current weight', () => {
    renderComponent()

    expect(screen.getByText('78.0 kg')).toBeInTheDocument()
  })

  it('renders lowest weight', () => {
    renderComponent()

    expect(screen.getByText(/78.0 kg lowest/i)).toBeInTheDocument()
  })

  it('renders highest weight', () => {
    renderComponent()

    expect(screen.getByText(/80.0 kg highest/i)).toBeInTheDocument()
  })

  it('renders target progress when a target weight exists', () => {
    renderComponent()

    expect(
      screen.getByText(/3.0 kg remaining to reach 75 kg/i),
    ).toBeInTheDocument()
  })

  it('renders target setup message when no target weight exists', () => {
    renderComponent({
      targetWeight: null,
    })

    expect(
      screen.getByText(/set a target weight to track your progress/i),
    ).toBeInTheDocument()
  })

  it('renders target reached message', () => {
    renderComponent({
      targetWeight: 80,
    })

    expect(screen.getByText(/target 80.0 kg reached/i)).toBeInTheDocument()
  })

  it('passes entries to EditWeightsSheet', () => {
    renderComponent()

    expect(screen.getByTestId('edit-weights-sheet')).toHaveTextContent('2')
  })

  it('calls addWeight when a weight is saved', async () => {
    const { user, addWeight } = renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: /mock save weight/i,
      }),
    )

    expect(addWeight).toHaveBeenCalledTimes(1)
    expect(addWeight).toHaveBeenCalledWith(
      72.5,
      new Date('2026-01-15T12:00:00.000Z'),
    )
  })

  it('shows a success toast after adding a weight', async () => {
    const { user } = renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: /mock save weight/i,
      }),
    )

    expect(toast.success).toHaveBeenCalledWith('Weight added')
  })

  it('hydrates cadence from localStorage', () => {
    localStorage.setItem(WEIGHT_STATISTICS_CADENCE_STORAGE_KEY, 'month')

    renderComponent()

    expect(screen.getByRole('combobox')).toHaveTextContent(/month/i)
  })

  it('falls back when localStorage contains an invalid cadence', () => {
    localStorage.setItem(WEIGHT_STATISTICS_CADENCE_STORAGE_KEY, 'invalid')

    renderComponent()

    expect(screen.getByRole('combobox')).toHaveTextContent(/week/i)
  })

  it('disables the add button when loading', () => {
    renderComponent({
      isLoading: true,
    })

    expect(
      screen.getByRole('button', {
        name: /add/i,
      }),
    ).toBeDisabled()
  })
})
