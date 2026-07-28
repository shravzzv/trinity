'use client'

import { useEffect, useState } from 'react'
import { type Session } from '@supabase/supabase-js'
import { createClient } from '@/supabase/client'

/**
 * The current authentication state of the client.
 */
interface UseAuthResult {
  /**
   * Whether the initial authentication state is still being determined.
   */
  isLoading: boolean

  /**
   * The active authenticated session, or `null` if the user is signed out.
   */
  session: Session | null

  /**
   * Whether the user is currently authenticated.
   *
   * This value is derived from the presence of an active session.
   */
  isAuthenticated: boolean
}

/**
 * Subscribes to Supabase authentication state changes and exposes the current
 * client authentication state.
 *
 * The hook automatically updates when the user signs in, signs out, or their
 * session changes, allowing the UI to react without requiring a page refresh.
 *
 * @returns The current authentication state.
 */
export function useAuth(): UseAuthResult {
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
  }
}
