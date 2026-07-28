import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SigninForm from '@/components/signin-form'
import { signin } from '@/lib/auth'

jest.mock('@/lib/auth', () => ({
  signin: jest.fn(),
}))

describe('SigninForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders email and password inputs', () => {
    render(<SigninForm />)

    const emailInput = screen.getByPlaceholderText(/m@example.com/i)
    const password = screen.getByPlaceholderText(/enter password/i)

    expect(emailInput).toBeInTheDocument()
    expect(password).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    render(<SigninForm />)

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders important links', () => {
    render(<SigninForm />)

    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: /forgot password/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: /terms of service/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: /privacy policy/i }),
    ).toBeInTheDocument()
  })

  it('does not submit invalid form', async () => {
    const user = userEvent.setup()

    render(<SigninForm />)

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(signin).not.toHaveBeenCalled()
    expect(screen.getByText(/a valid email is required/i)).toBeInTheDocument()
  })

  it('submits valid credentials', async () => {
    ;(signin as jest.Mock).mockResolvedValue(undefined)

    render(<SigninForm />)

    const user = userEvent.setup()
    await user.type(
      screen.getByRole('textbox', { name: /email/i }),
      'john@example.com',
    )
    const password = screen.getByPlaceholderText(/enter password/i)

    await user.type(password, 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => expect(signin).toHaveBeenCalledTimes(1))
  })

  it('shows server error', async () => {
    const user = userEvent.setup()

    ;(signin as jest.Mock).mockResolvedValue({
      error: 'Invalid credentials',
    })

    render(<SigninForm />)

    await user.type(
      screen.getByRole('textbox', { name: /email/i }),
      'john@example.com',
    )

    const password = screen.getByPlaceholderText(/enter password/i)

    await user.type(password, 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()
  })

  it('shows loading state while submitting', async () => {
    const user = userEvent.setup()
    let resolve!: (value?: unknown) => void

    ;(signin as jest.Mock).mockImplementation(
      () =>
        new Promise((r) => {
          resolve = r
        }),
    )

    render(<SigninForm />)

    await user.type(
      screen.getByRole('textbox', { name: /email/i }),
      'john@example.com',
    )

    const password = screen.getByPlaceholderText(/enter password/i)
    await user.type(password, 'password123')

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled()

    resolve()

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled(),
    )
  })

  it('clears previous server error before retrying', async () => {
    const user = userEvent.setup()

    ;(signin as jest.Mock)
      .mockResolvedValueOnce({
        error: 'Invalid credentials',
      })
      .mockResolvedValueOnce(undefined)

    render(<SigninForm />)

    const email = screen.getByRole('textbox', {
      name: /email/i,
    })

    const password = screen.getByPlaceholderText(/enter password/i)

    await user.type(email, 'john@example.com')
    await user.type(password, 'password123')

    const submit = screen.getByRole('button', {
      name: /sign in/i,
    })

    await user.click(submit)

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()

    await user.click(submit)

    await waitFor(() =>
      expect(
        screen.queryByText(/invalid credentials/i),
      ).not.toBeInTheDocument(),
    )
  })
})
