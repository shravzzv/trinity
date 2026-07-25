import { signin } from '@/app/actions'
import { createClient } from '@/supabase/server'
import { redirect } from 'next/navigation'

jest.mock('@/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('signin', () => {
  let consoleErrorSpy: jest.SpyInstance
  const signInWithPassword = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    ;(createClient as jest.Mock).mockResolvedValue({
      auth: {
        signInWithPassword,
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
    signInWithPassword.mockResolvedValue({
      error: null,
    })

    await signin(createFormData())

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'password123',
    })
  })

  it('redirects to /home after a successful sign in', async () => {
    signInWithPassword.mockResolvedValue({
      error: null,
    })

    await signin(createFormData())

    expect(redirect).toHaveBeenCalledWith('/home')
  })

  it('returns an invalid credentials error', async () => {
    signInWithPassword.mockResolvedValue({
      error: {
        code: 'invalid_credentials',
      },
    })

    await expect(signin(createFormData())).resolves.toEqual({
      error: 'Invalid email or password.',
    })
  })

  it('returns a generic error for unexpected failures', async () => {
    signInWithPassword.mockResolvedValue({
      error: {
        code: 'unexpected_failure',
      },
    })

    await expect(signin(createFormData())).resolves.toEqual({
      error: 'Unable to sign in. Please try again.',
    })
  })
})
