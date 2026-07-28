'use client'

import { useAuth } from '@/hooks/use-auth'
import { createContext, useContext } from 'react'

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useAuth()

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }

  return context
}
