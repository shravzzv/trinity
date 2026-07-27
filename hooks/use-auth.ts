'use client'

import { useEffect, useState } from 'react'
import { type Session } from '@supabase/supabase-js'
import { createClient } from '@/supabase/client'

interface UseAuthResult {
  isLoading: boolean
  session: Session | null
  isAuthenticated: boolean
}

export function useAuth(): UseAuthResult {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
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
