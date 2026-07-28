import { signOut, signin } from '@/lib/auth'
import { createClient } from '@/supabase/client'
import { redirect } from 'next/navigation'

jest.mock('@/supabase/client', () => ({
  createClient: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('signOut', () => {
  let consoleErrorSpy: jest.SpyInstance
  const signOutMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    ;(createClient as jest.Mock).mockReturnValue({
      auth: {
        signOut: signOutMock,
      },
    })
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('signs out with the provided scope', async () => {
    signOutMock.mockResolvedValue({
      error: null,
    })

    await signOut('local')

    expect(signOutMock).toHaveBeenCalledWith({
      scope: 'local',
    })
  })

  it('redirects to /signin after a successful sign out', async () => {
    signOutMock.mockResolvedValue({
      error: null,
    })

    await signOut('local')

    expect(redirect).toHaveBeenCalledWith('/signin')
  })

  it('logs the error and redirects to the auth error page when sign out fails', async () => {
    const error = new Error('Sign out failed')

    signOutMock.mockResolvedValue({
      error,
    })

    await signOut('local')

    expect(console.error).toHaveBeenCalledWith(error)
    expect(redirect).toHaveBeenCalledWith('/auth-error')
  })
})

describe('signin', () => {
  let consoleErrorSpy: jest.SpyInstance

  const signInWithPasswordMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    ;(createClient as jest.Mock).mockReturnValue({
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
    const error = {
      code: 'invalid_credentials',
    }

    signInWithPasswordMock.mockResolvedValue({
      error,
    })

    await expect(signin(createFormData())).resolves.toEqual({
      error: 'Invalid email or password.',
    })

    expect(console.error).toHaveBeenCalledWith(error)
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a generic error for unexpected failures', async () => {
    const error = {
      code: 'unexpected_failure',
    }

    signInWithPasswordMock.mockResolvedValue({
      error,
    })

    await expect(signin(createFormData())).resolves.toEqual({
      error: 'Unable to sign in. Please try again.',
    })

    expect(console.error).toHaveBeenCalledWith(error)
    expect(redirect).not.toHaveBeenCalled()
  })
})
