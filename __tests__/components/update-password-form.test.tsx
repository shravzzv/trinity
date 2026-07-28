import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UpdatePasswordForm from '@/components/update-password-form'
import { updatePassword } from '@/app/actions'

jest.mock('@/app/actions', () => ({
  updatePassword: jest.fn(),
}))

describe('UpdatePasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the update password form', () => {
    render(<UpdatePasswordForm />)

    expect(
      screen.getByRole('heading', {
        name: /update your password/i,
      }),
    ).toBeInTheDocument()

    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /update password/i,
      }),
    ).toBeInTheDocument()
  })

  it('shows a validation error when the password is too short', async () => {
    const user = userEvent.setup()

    render(<UpdatePasswordForm />)

    await user.type(screen.getByLabelText(/^password$/i), 'short')

    await user.click(
      screen.getByRole('button', {
        name: /update password/i,
      }),
    )

    expect(
      await screen.findByText(/password must be at least 8 characters long/i),
    ).toBeInTheDocument()

    expect(updatePassword).not.toHaveBeenCalled()
  })

  it('submits the entered password', async () => {
    const user = userEvent.setup()

    ;(updatePassword as jest.Mock).mockResolvedValue(undefined)

    render(<UpdatePasswordForm />)

    await user.type(screen.getByLabelText(/^password$/i), 'new-password-123')

    await user.click(
      screen.getByRole('button', {
        name: /update password/i,
      }),
    )

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalledTimes(1)
    })

    const formData = (updatePassword as jest.Mock).mock.calls[0][0]

    expect(formData).toBeInstanceOf(FormData)
    expect(formData.get('password')).toBe('new-password-123')
  })

  it('shows an error returned from the action', async () => {
    const user = userEvent.setup()

    ;(updatePassword as jest.Mock).mockResolvedValue({
      error: 'Something went wrong',
    })

    render(<UpdatePasswordForm />)

    await user.type(screen.getByLabelText(/^password$/i), 'new-password-123')

    await user.click(
      screen.getByRole('button', {
        name: /update password/i,
      }),
    )

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument()
  })

  it('updates the password length indicator while typing', async () => {
    const user = userEvent.setup()

    render(<UpdatePasswordForm />)

    expect(screen.getByText(/0\/8/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/^password$/i), 'abcd')

    expect(screen.getByText(/4\/8/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/^password$/i), '1234')

    expect(screen.getByText(/8\/8/i)).toBeInTheDocument()
  })
})
