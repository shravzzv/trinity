'use client'

import { useGamification } from '@/hooks/use-gamification'
import { createContext, useContext } from 'react'

const GamificationContext = createContext<ReturnType<
  typeof useGamification
> | null>(null)

export const GamificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const value = useGamification()

  return <GamificationContext value={value}>{children}</GamificationContext>
}

export function useGamificationContext() {
  const context = useContext(GamificationContext)

  if (!context)
    throw new Error(
      'useGamificationContext must be used within GamificationProvider',
    )

  return context
}
