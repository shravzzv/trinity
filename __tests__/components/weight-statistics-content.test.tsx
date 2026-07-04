import WeightStatisticsContent from '@/components/weight-statistics-content'
import { WEIGHT_STATISTICS_CADENCE_STORAGE_KEY } from '@/constants/storage-keys'
import { render, screen, waitFor } from '@testing-library/react'
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
    onSave: (weightKg: number, recordedAt: Date) => Promise<void>
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
  props: Partial<React.ComponentProps<typeof WeightStatisticsContent>> = {},
) => {
  const addWeight = jest.fn().mockResolvedValue(undefined)
  const updateWeight = jest.fn().mockResolvedValue(undefined)
  const deleteWeight = jest.fn().mockResolvedValue(undefined)

  render(
    <WeightStatisticsContent
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

Object.defineProperties(HTMLElement.prototype, {
  hasPointerCapture: {
    value: jest.fn(),
  },
  setPointerCapture: {
    value: jest.fn(),
  },
  releasePointerCapture: {
    value: jest.fn(),
  },
})

describe('WeightStatisticsContent', () => {
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

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Weight added')
    })
  })

  it('shows an error toast when adding a weight fails', async () => {
    const error = new Error('Failed to save weight')

    const { user } = renderComponent({
      addWeight: jest.fn().mockRejectedValue(error),
    })

    await user.click(
      screen.getByRole('button', {
        name: /mock save weight/i,
      }),
    )

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to save weight')
    })
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

  it('persists cadence changes', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    renderComponent()

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    })

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Month'))

    expect(setItemSpy).toHaveBeenCalledWith(
      WEIGHT_STATISTICS_CADENCE_STORAGE_KEY,
      'month',
    )
  })

  it('removes corrupted cadence storage when hydration throws', () => {
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('boom')
      })

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    renderComponent()

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Hydrating weight statistics cadence failed',
      expect.any(Error),
    )

    expect(removeItemSpy).toHaveBeenCalledWith(
      WEIGHT_STATISTICS_CADENCE_STORAGE_KEY,
    )

    getItemSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it('renders no weight change when only one entry exists', () => {
    renderComponent({
      entries: [
        {
          id: '1',
          weightKg: 80,
          recordedAt: new Date('2026-01-15T12:00:00Z').toISOString(),
        },
      ],
    })

    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders weight loss summary', () => {
    renderComponent()

    expect(screen.getByText(/2.0 kg lost this week/i)).toBeInTheDocument()
  })

  it('renders weight gain summary', () => {
    renderComponent({
      entries: [
        {
          id: '1',
          weightKg: 78,
          recordedAt: new Date('2026-01-10T12:00:00Z').toISOString(),
        },
        {
          id: '2',
          weightKg: 80,
          recordedAt: new Date('2026-01-15T12:00:00Z').toISOString(),
        },
      ],
    })

    expect(screen.getByText(/2.0 kg gained this week/i)).toBeInTheDocument()
  })

  it('renders all cadence options', async () => {
    const { user } = renderComponent()
    await user.click(screen.getByRole('combobox'))

    expect(screen.getByRole('option', { name: 'Week' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Month' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Year' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument()
  })

  it('updates cadence selection', async () => {
    const { user } = renderComponent()

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Year'))

    expect(screen.getByRole('combobox')).toHaveTextContent(/year/i)
  })
})
