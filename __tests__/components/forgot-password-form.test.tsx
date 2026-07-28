import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ForgotPasswordForm from '@/components/forgot-password-form'
import { sendPasswordResetEmail } from '@/app/actions'

jest.mock('@/app/actions', () => ({
  sendPasswordResetEmail: jest.fn(),
}))

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the form', () => {
    render(<ForgotPasswordForm />)

    expect(
      screen.getByRole('heading', {
        name: /reset your password/i,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /send password reset link/i,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: /sign in/i,
      }),
    ).toHaveAttribute('href', '/signin')
  })

  it('shows a validation error when the email is invalid', async () => {
    const user = userEvent.setup()

    render(<ForgotPasswordForm />)

    await user.type(screen.getByLabelText(/email/i), 'not-an-email')

    await user.click(
      screen.getByRole('button', {
        name: /send password reset link/i,
      }),
    )

    expect(screen.getByLabelText(/email/i)).toBeInvalid()
    expect(sendPasswordResetEmail).not.toHaveBeenCalled()
  })

  it('submits the entered email', async () => {
    const user = userEvent.setup()

    ;(sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined)

    render(<ForgotPasswordForm />)

    await user.type(screen.getByLabelText(/email/i), 'john@example.com')

    await user.click(
      screen.getByRole('button', {
        name: /send password reset link/i,
      }),
    )

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledTimes(1)
    })

    const formData = (sendPasswordResetEmail as jest.Mock).mock.calls[0][0]

    expect(formData).toBeInstanceOf(FormData)
    expect(formData.get('email')).toBe('john@example.com')
  })

  it('shows an error returned from the action', async () => {
    const user = userEvent.setup()

    ;(sendPasswordResetEmail as jest.Mock).mockResolvedValue({
      error: 'Something went wrong',
    })

    render(<ForgotPasswordForm />)

    await user.type(screen.getByLabelText(/email/i), 'john@example.com')

    await user.click(
      screen.getByRole('button', {
        name: /send password reset link/i,
      }),
    )

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument()

    expect(screen.queryByText(/check your email/i)).not.toBeInTheDocument()
  })

  it('opens the confirmation dialog after a successful submission', async () => {
    const user = userEvent.setup()

    ;(sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined)

    render(<ForgotPasswordForm />)

    await user.type(screen.getByLabelText(/email/i), 'john@example.com')

    await user.click(
      screen.getByRole('button', {
        name: /send password reset link/i,
      }),
    )

    expect(
      await screen.findByRole('heading', {
        name: /check your email/i,
      }),
    ).toBeInTheDocument()

    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument()
  })

  it('clears a previous error after a successful submission', async () => {
    const user = userEvent.setup()

    ;(sendPasswordResetEmail as jest.Mock)
      .mockResolvedValueOnce({
        error: 'Something went wrong',
      })
      .mockResolvedValueOnce(undefined)

    render(<ForgotPasswordForm />)

    const input = screen.getByLabelText(/email/i)
    const button = screen.getByRole('button', {
      name: /send password reset link/i,
    })

    await user.type(input, 'john@example.com')
    await user.click(button)

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument()

    await user.clear(input)
    await user.type(input, 'john@example.com')
    await user.click(button)

    await waitFor(() => {
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
    })

    expect(
      await screen.findByRole('heading', {
        name: /check your email/i,
      }),
    ).toBeInTheDocument()
  })
})
