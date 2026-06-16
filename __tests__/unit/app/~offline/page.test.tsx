import Page from '@/app/~offline/page'
import { render, screen } from '@testing-library/react'

describe('Offline page', () => {
  it(`should contain the offline message`, () => {
    render(<Page />)
    expect(screen.getByText('You are offline')).toBeInTheDocument()
  })

  it('should match the snapshot', () => {
    const { container } = render(<Page />)
    expect(container).toMatchSnapshot()
  })
})
