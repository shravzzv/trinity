import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignupForm from '@/components/signup-form'
import { signup } from '@/app/actions'

jest.mock('@/app/actions', () => ({
  signup: jest.fn(),
}))

const mockedSignup = jest.mocked(signup)

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  async function fillAndSubmit() {
    const user = userEvent.setup()

    await user.type(
      screen.getByRole('textbox', {
        name: /email/i,
      }),
      'john@example.com',
    )

    await user.type(screen.getByLabelText(/^password$/i), 'password123')

    await user.click(
      screen.getByRole('button', {
        name: /sign up/i,
      }),
    )
  }

  it('submits the form data', async () => {
    mockedSignup.mockResolvedValue(undefined)

    render(<SignupForm />)

    await fillAndSubmit()

    await waitFor(() => {
      expect(mockedSignup).toHaveBeenCalledTimes(1)
    })

    const formData = mockedSignup.mock.calls[0][0]

    expect(formData).toBeInstanceOf(FormData)
    expect(formData.get('email')).toBe('john@example.com')
    expect(formData.get('password')).toBe('password123')
  })

  it('shows a server error returned from signup', async () => {
    mockedSignup.mockResolvedValue({
      error: 'An account with this email already exists.',
    })

    render(<SignupForm />)

    await fillAndSubmit()

    expect(
      await screen.findByText('An account with this email already exists.'),
    ).toBeInTheDocument()
  })

  it('shows the confirmation dialog after a successful signup', async () => {
    mockedSignup.mockResolvedValue(undefined)

    render(<SignupForm />)

    await fillAndSubmit()

    expect(
      await screen.findByRole('heading', {
        name: /check your email/i,
      }),
    ).toBeInTheDocument()

    expect(screen.getByText(/john@example\.com/i)).toBeInTheDocument()
    expect(screen.getByText(/verification email/i)).toBeInTheDocument()
  })

  it('disables the form after a successful signup', async () => {
    mockedSignup.mockResolvedValue(undefined)

    render(<SignupForm />)

    await fillAndSubmit()

    await screen.findByRole('heading', {
      name: /check your email/i,
    })

    expect(screen.getByLabelText(/^email$/i)).toBeDisabled()
    expect(screen.getByLabelText(/^password$/i)).toBeDisabled()

    expect(
      screen.getByRole('button', {
        name: /sign up/i,
        hidden: true,
      }),
    ).toBeDisabled()

    expect(
      screen.getByRole('button', {
        name: /continue with google/i,
        hidden: true,
      }),
    ).toBeDisabled()

    expect(
      screen.getByRole('button', {
        name: /continue with github/i,
        hidden: true,
      }),
    ).toBeDisabled()
  })

  it('shows a loading state while submitting', async () => {
    let resolve!: (value: Awaited<ReturnType<typeof signup>>) => void

    mockedSignup.mockImplementation(
      () =>
        new Promise((r) => {
          resolve = r
        }),
    )

    render(<SignupForm />)

    await fillAndSubmit()

    expect(
      screen.getByRole('button', {
        name: /loading/i,
      }),
    ).toBeDisabled()

    resolve(undefined)

    expect(
      await screen.findByRole('heading', {
        name: /check your email/i,
      }),
    ).toBeInTheDocument()
  })

  it('prevents submission when validation fails', async () => {
    const user = userEvent.setup()

    render(<SignupForm />)

    await user.click(
      screen.getByRole('button', {
        name: /sign up/i,
      }),
    )

    expect(mockedSignup).not.toHaveBeenCalled()

    expect(
      await screen.findByText(/a valid email is required/i),
    ).toBeInTheDocument()

    expect(
      screen.getByText(/password must be at least 8 characters long/i),
    ).toBeInTheDocument()
  })
})
