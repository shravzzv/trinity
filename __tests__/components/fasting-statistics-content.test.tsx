import { render, screen } from '@testing-library/react'
import EditFastsSheet from '@/components/edit-fasts-sheet'
import FastDialog from '@/components/fast-dialog'
import type { Fast } from '@/types/fasting'
import FastingStatisticsContent from '@/components/fasting-statistics-content'
import { toast } from 'sonner'
import { FASTING_STATISTICS_CADENCE_STORAGE_KEY } from '@/constants/storage-keys'

jest.mock('uuid')
jest.mock('sonner')

jest.mock('@/components/edit-fasts-sheet', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid='edit-fasts-sheet' />),
}))

jest.mock('@/components/fast-dialog', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid='fast-dialog' />),
}))

jest.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='chart-container'>{children}</div>
  ),
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}))

jest.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Bar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CartesianGrid: () => null,
  XAxis: () => null,
  LabelList: () => null,
}))

const addFast = jest.fn()
const deleteFast = jest.fn()
const updateFast = jest.fn()

const fasts: Fast[] = [
  {
    id: '1',
    startedAt: '2026-01-01T10:00:00.000Z',
    endedAt: '2026-01-01T18:00:00.000Z',
    streakStatus: 'completed',
    planId: '',
  },
  {
    id: '2',
    startedAt: '2026-01-02T10:00:00.000Z',
    endedAt: '2026-01-02T22:00:00.000Z',
    streakStatus: 'completed',
    planId: '',
  },
]

const renderComponent = (customFasts: Fast[] = fasts, planId = '16:8') => {
  render(
    <FastingStatisticsContent
      planId={planId}
      addFast={addFast}
      fasts={customFasts}
      deleteFast={deleteFast}
      updateFast={updateFast}
      preferredFastStartTime={null}
    />,
  )
}

describe('FastingStatisticsContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-01-03T00:00:00.000Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render the title', () => {
    renderComponent()

    expect(screen.getByText(/fasting statistics/i)).toBeInTheDocument()
  })

  it('should render the chart container', () => {
    renderComponent()

    expect(screen.getByTestId('chart-container')).toBeInTheDocument()
  })

  it('should show zero statistics when no fasts exist', () => {
    renderComponent([])

    expect(screen.getByText('0 fasts')).toBeInTheDocument()
    expect(screen.getByText('0.0h average')).toBeInTheDocument()
    expect(screen.getByText('0.0h longest')).toBeInTheDocument()
  })

  it('should calculate statistics correctly', () => {
    renderComponent()

    expect(screen.getByText('2 fasts')).toBeInTheDocument()
    expect(screen.getByText('10.0h average')).toBeInTheDocument()
    expect(screen.getByText('12.0h longest')).toBeInTheDocument()
  })

  it('should display the date range', () => {
    renderComponent()

    expect(
      screen.getByText(/january 1, 2026 - january 2, 2026/i),
    ).toBeInTheDocument()
  })

  it('should display a fallback date range when there are no fasts', () => {
    renderComponent([])

    expect(screen.getByText(/no fasting data available/i)).toBeInTheDocument()
  })

  it('should render EditFastsSheet', () => {
    renderComponent()

    expect(screen.getByTestId('edit-fasts-sheet')).toBeInTheDocument()
  })

  it('should render FastDialog', () => {
    renderComponent()

    expect(screen.getByTestId('fast-dialog')).toBeInTheDocument()
  })

  it('should pass the correct props to EditFastsSheet', () => {
    renderComponent()

    expect(EditFastsSheet).toHaveBeenCalledWith(
      expect.objectContaining({
        fasts,
        deleteFast,
        updateFast,
      }),
      undefined,
    )
  })

  it('should pass the correct props to FastDialog', () => {
    renderComponent()

    expect(FastDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        existingFasts: fasts,
        submitLabel: 'Add fast',
      }),
      undefined,
    )
  })

  it('should add a fast when FastDialog submits', () => {
    renderComponent()

    const props = (FastDialog as jest.Mock).mock.calls[0][0]

    props.onSubmit(
      new Date('2026-01-01T10:00:00.000Z'),
      new Date('2026-01-01T18:00:00.000Z'),
    )

    expect(addFast).toHaveBeenCalledWith({
      id: 'test-uuid',
      startedAt: '2026-01-01T10:00:00.000Z',
      endedAt: '2026-01-01T18:00:00.000Z',
      planId: '16:8',
      streakStatus: 'missed',
    })
  })

  it('should pass all existing fasts to FastDialog', () => {
    renderComponent()

    const props = (FastDialog as jest.Mock).mock.calls[0][0]

    expect(props.existingFasts).toEqual(fasts)
  })

  it('shows an error toast when adding a fast fails', async () => {
    addFast.mockRejectedValueOnce(new Error('Boom'))

    renderComponent()

    const props = (FastDialog as jest.Mock).mock.calls[0][0]

    await props.onSubmit(
      new Date('2026-01-01T10:00:00.000Z'),
      new Date('2026-01-01T18:00:00.000Z'),
    )

    expect(toast.error).toHaveBeenCalledWith('Boom')
  })

  it('shows a success toast when adding a fast', async () => {
    renderComponent()

    const props = (FastDialog as jest.Mock).mock.calls[0][0]

    await props.onSubmit(
      new Date('2026-01-01T10:00:00.000Z'),
      new Date('2026-01-01T18:00:00.000Z'),
    )

    expect(toast.success).toHaveBeenCalledWith('Fast added')
  })

  it('hydrates cadence from local storage', () => {
    localStorage.setItem(FASTING_STATISTICS_CADENCE_STORAGE_KEY, 'month')

    renderComponent()

    expect(
      screen.getByRole('combobox', {
        name: /fasting statistics cadence/i,
      }),
    ).toBeInTheDocument()
  })
})
