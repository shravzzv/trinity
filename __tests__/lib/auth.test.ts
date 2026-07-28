import { signOut } from '@/lib/auth'
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
