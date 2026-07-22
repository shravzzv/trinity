import Page from '@/app/not-found'
import { render, screen } from '@testing-library/react'

describe('Not-found page', () => {
  it(`should contain a 404 heading with a "page not found" subheading`, () => {
    render(<Page />)
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Page not found/i }),
    ).toBeInTheDocument()
  })

  it('should contain a link back to the home page', () => {
    render(<Page />)
    const link = screen.getByRole('link', { name: /go home/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/home')
  })

  it('should explain that the page could not be found', () => {
    render(<Page />)
    expect(
      screen.getByText(/doesn't exist or may have been moved/i),
    ).toBeInTheDocument()
  })

  it('should match the snapshot', () => {
    const { container } = render(<Page />)
    expect(container).toMatchSnapshot()
  })
})
