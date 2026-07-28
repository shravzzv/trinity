import {
  sendPasswordResetEmail,
  signin,
  signInWithProvider,
  signup,
  updatePassword,
} from '@/app/actions'
import { getSiteURL } from '@/lib/links'
import { createClient } from '@/supabase/server'
import { redirect } from 'next/navigation'

jest.mock('@/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

jest.mock('@/lib/links', () => ({
  getSiteURL: jest.fn(),
}))

describe('signin', () => {
  let consoleErrorSpy: jest.SpyInstance
  const signInWithPasswordMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    ;(getSiteURL as jest.Mock).mockReturnValue('https://trinity-fit.vercel.app')

    ;(createClient as jest.Mock).mockResolvedValue({
      auth: {
        signInWithPassword: signInWithPasswordMock,
      },
    })
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  function createFormData() {
    const formData = new FormData()
    formData.append('email', 'john@example.com')
    formData.append('password', 'password123')
    return formData
  }

  it('signs in with the provided credentials', async () => {
    signInWithPasswordMock.mockResolvedValue({
      error: null,
    })

    await signin(createFormData())

    expect(signInWithPasswordMock).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'password123',
    })
  })

  it('redirects to /home after a successful sign in', async () => {
    signInWithPasswordMock.mockResolvedValue({
      error: null,
    })

    await signin(createFormData())

    expect(redirect).toHaveBeenCalledWith('/home')
  })

  it('returns an invalid credentials error', async () => {
    signInWithPasswordMock.mockResolvedValue({
      error: {
        code: 'invalid_credentials',
      },
    })

    await expect(signin(createFormData())).resolves.toEqual({
      error: 'Invalid email or password.',
    })
  })

  it('returns a generic error for unexpected failures', async () => {
    signInWithPasswordMock.mockResolvedValue({
      error: {
        code: 'unexpected_failure',
      },
    })

    await expect(signin(createFormData())).resolves.toEqual({
      error: 'Unable to sign in. Please try again.',
    })
  })
})

describe('signup', () => {
  let consoleErrorSpy: jest.SpyInstance
  const signUpMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    ;(getSiteURL as jest.Mock).mockReturnValue('https://trinity-fit.vercel.app')

    ;(createClient as jest.Mock).mockResolvedValue({
      auth: {
        signUp: signUpMock,
      },
    })
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  function createFormData() {
    const formData = new FormData()
    formData.append('email', 'john@example.com')
    formData.append('password', 'password123')
    return formData
  }

  it('signs up with the provided credentials', async () => {
    signUpMock.mockResolvedValue({
      error: null,
    })

    await signup(createFormData())

    expect(signUpMock).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'password123',
      options: {
        emailRedirectTo: 'https://trinity-fit.vercel.app/home',
      },
    })
  })

  it('returns a user already exists error', async () => {
    signUpMock.mockResolvedValue({
      error: {
        code: 'user_already_exists',
      },
    })

    await expect(signup(createFormData())).resolves.toEqual({
      error: 'An account with this email already exists.',
    })
  })

  it('redirects to /auth-error on other errors', async () => {
    const error = {
      code: 'some_other_code',
    }

    signUpMock.mockResolvedValue({ error })

    await signup(createFormData())

    expect(console.error).toHaveBeenCalledWith(error)
    expect(redirect).toHaveBeenCalledWith('/auth-error')
  })

  it('returns without redirecting on successful signup', async () => {
    signUpMock.mockResolvedValue({
      error: null,
    })

    await expect(signup(createFormData())).resolves.toBeUndefined()

    expect(redirect).not.toHaveBeenCalled()
  })
})

describe('signInWithProvider', () => {
  let consoleErrorSpy: jest.SpyInstance
  const signInWithOAuthMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    ;(getSiteURL as jest.Mock).mockReturnValue('https://trinity-fit.vercel.app')

    ;(createClient as jest.Mock).mockResolvedValue({
      auth: {
        signInWithOAuth: signInWithOAuthMock,
      },
    })
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('initiates OAuth sign-in with the correct provider and redirect URL', async () => {
    signInWithOAuthMock.mockResolvedValue({
      data: {
        url: 'https://accounts.google.com/oauth',
      },
      error: null,
    })

    await signInWithProvider('google')

    expect(signInWithOAuthMock).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: 'https://trinity-fit.vercel.app/auth/callback?next=%2Fhome',
      },
    })
  })

  it('redirects to the provider authorization URL on success', async () => {
    signInWithOAuthMock.mockResolvedValue({
      data: {
        url: 'https://accounts.google.com/oauth',
      },
      error: null,
    })

    await signInWithProvider('google')

    expect(redirect).toHaveBeenCalledWith('https://accounts.google.com/oauth')
  })

  it('logs the error and redirects to the auth error page when OAuth initiation fails', async () => {
    const error = new Error('OAuth failed')

    signInWithOAuthMock.mockResolvedValue({
      data: {
        url: '',
      },
      error,
    })

    await signInWithProvider('google')

    expect(console.error).toHaveBeenCalledWith(error)
    expect(redirect).toHaveBeenCalledWith('/auth-error')
  })
})

describe('sendPasswordResetEmail', () => {
  const resetPasswordForEmailMock = jest.fn()
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    ;(getSiteURL as jest.Mock).mockReturnValue('https://example.com')
    ;(createClient as jest.Mock).mockResolvedValue({
      auth: {
        resetPasswordForEmail: resetPasswordForEmailMock,
      },
    })
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('calls resetPasswordForEmail with the provided email', async () => {
    resetPasswordForEmailMock.mockResolvedValue({
      error: null,
    })

    const formData = new FormData()
    formData.set('email', 'john@example.com')

    await sendPasswordResetEmail(formData)

    expect(resetPasswordForEmailMock).toHaveBeenCalledWith('john@example.com', {
      redirectTo: 'https://example.com/update-password',
    })
  })

  it('uses the site URL when constructing the redirect URL', async () => {
    resetPasswordForEmailMock.mockResolvedValue({
      error: null,
    })

    const formData = new FormData()
    formData.set('email', 'john@example.com')

    await sendPasswordResetEmail(formData)

    expect(getSiteURL).toHaveBeenCalled()
  })

  it('returns the error message when Supabase returns an error', async () => {
    resetPasswordForEmailMock.mockResolvedValue({
      error: {
        message: 'Failed to send password reset email',
      },
    })

    const formData = new FormData()
    formData.set('email', 'john@example.com')

    await expect(sendPasswordResetEmail(formData)).resolves.toEqual({
      error: 'Failed to send password reset email',
    })
  })

  it('returns undefined when the password reset email is sent successfully', async () => {
    resetPasswordForEmailMock.mockResolvedValue({
      error: null,
    })

    const formData = new FormData()
    formData.set('email', 'john@example.com')

    await expect(sendPasswordResetEmail(formData)).resolves.toBeUndefined()
  })
})

describe('updatePassword', () => {
  const updateUserMock = jest.fn()
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    ;(createClient as jest.Mock).mockResolvedValue({
      auth: {
        updateUser: updateUserMock,
      },
    })
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('calls updateUser with the provided password', async () => {
    updateUserMock.mockResolvedValue({
      error: null,
    })

    const formData = new FormData()
    formData.set('password', 'new-password-123')

    await updatePassword(formData)

    expect(updateUserMock).toHaveBeenCalledWith({
      password: 'new-password-123',
    })
  })

  it('redirects to /home after successfully updating the password', async () => {
    updateUserMock.mockResolvedValue({
      error: null,
    })

    const formData = new FormData()
    formData.set('password', 'new-password-123')

    await updatePassword(formData)

    expect(redirect).toHaveBeenCalledWith('/home')
  })

  it('returns the error message when Supabase returns an error', async () => {
    updateUserMock.mockResolvedValue({
      error: {
        message: 'Auth session missing',
      },
    })

    const formData = new FormData()
    formData.set('password', 'new-password-123')

    await expect(updatePassword(formData)).resolves.toEqual({
      error: 'Auth session missing',
    })

    expect(redirect).not.toHaveBeenCalled()
  })

  it('does not redirect when updating the password fails', async () => {
    updateUserMock.mockResolvedValue({
      error: {
        message: 'Something went wrong',
      },
    })

    const formData = new FormData()
    formData.set('password', 'new-password-123')

    await updatePassword(formData)

    expect(redirect).not.toHaveBeenCalled()
  })
})
