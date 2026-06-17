import Page from '@/app/page'
import FastingPlanCard from '@/components/fasting-plan-card'
import { FASTING_PLAN_LOCAL_STORAGE_KEY } from '@/constants/storage-keys'
import { render, screen } from '@testing-library/react'

jest.mock('@/components/fasting-plan-card', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mock Card</div>),
}))

describe('Home page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should contain the logo, title and the theme toggle', () => {
    render(<Page />)

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

  it('should hydrate the fasting plan from local storage', () => {
    localStorage.setItem(FASTING_PLAN_LOCAL_STORAGE_KEY, '20:4')
    render(<Page />)

    const mockedCard = jest.mocked(FastingPlanCard)

    expect(mockedCard).toHaveBeenLastCalledWith(
      expect.objectContaining({
        plan: '20:4',
      }),
      undefined,
    )
  })
})
