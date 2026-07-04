import { ThemeToggle } from '@/components/theme-toggle'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useTheme } from 'next-themes'

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

const setThemeMock = jest.fn()
const mockedUseTheme = jest.mocked(useTheme)

const getMockTheme = (theme: string) =>
  ({
    theme,
    setTheme: setThemeMock,
    themes: ['light', 'dark', 'system'],
    forcedTheme: undefined,
    resolvedTheme: theme,
    systemTheme: 'light',
  }) as ReturnType<typeof useTheme>

describe('Theme toggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseTheme.mockReturnValue(getMockTheme('light'))
  })

  it('should render the theme toggle button', () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button).toBeInTheDocument()
  })

  it('should contain a "toggle theme" text for screen readers only', () => {
    render(<ThemeToggle />)

    const text = screen.getByText('Toggle theme')
    expect(text).toHaveClass('sr-only')
  })

  it('should open a dropdown menu on click revealing theme options', async () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button', { name: /toggle theme/i })
    const user = userEvent.setup()

    await user.click(button)
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
    expect(screen.getByText('System')).toBeInTheDocument()
  })

  const themes = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ] as const

  it.each(themes)(
    'should set the $value theme when the option is clicked',
    async ({ label, value }) => {
      render(<ThemeToggle />)

      const button = screen.getByRole('button', { name: /toggle theme/i })
      const user = userEvent.setup()

      await user.click(button)
      await user.click(screen.getByRole('menuitem', { name: label }))

      expect(setThemeMock).toHaveBeenCalledWith(value)
    },
  )

  it.each(['light', 'dark', 'system'])(
    'shows a checkmark for the %s theme',
    async (theme) => {
      mockedUseTheme.mockReturnValue(getMockTheme(theme))

      render(<ThemeToggle />)

      const button = screen.getByRole('button', { name: /toggle theme/i })
      const user = userEvent.setup()
      await user.click(button)

      const activeItem = screen.getByRole('menuitem', {
        name: new RegExp(theme, 'i'),
      })

      expect(activeItem.querySelector('svg')).toBeInTheDocument()
    },
  )
})
