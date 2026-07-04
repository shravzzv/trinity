import Page from '@/app/page'
import { render, screen, waitFor } from '@testing-library/react'

jest.mock('@/components/fasting-plan-card', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mock Card</div>),
}))

jest.mock('@/lib/indexed-db', () => ({
  getFasts: jest.fn().mockResolvedValue([]),
  addFast: jest.fn().mockResolvedValue(undefined),
  updateFast: jest.fn().mockResolvedValue(undefined),
  deleteFast: jest.fn().mockResolvedValue(undefined),
  getWeightEntries: jest.fn().mockResolvedValue([]),
  addWeightEntry: jest.fn().mockResolvedValue(undefined),
  updateWeightEntry: jest.fn().mockResolvedValue(undefined),
  deleteWeightEntry: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('uuid')

describe('Home page', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should contain the logo, title and the theme toggle', async () => {
    render(<Page />)

    await waitFor(() => {
      expect(screen.getByAltText('Trinity')).toBeInTheDocument()
    })

    expect(screen.getByAltText('Trinity')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: /trinity/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /toggle theme/i,
      }),
    ).toBeInTheDocument()
  })
})
