import Page from '@/app/~offline/page'
import { render, screen } from '@testing-library/react'

describe('Offline page', () => {
  test(`should contain the offline message`, () => {
    render(<Page />)
    expect(screen.getByText('You are offline')).toBeInTheDocument()
  })

  test('should match the snapshot', () => {
    const { container } = render(<Page />)
    expect(container).toMatchSnapshot()
  })
})
