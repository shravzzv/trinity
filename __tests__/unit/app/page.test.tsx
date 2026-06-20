import Page from '@/app/page'
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
})
