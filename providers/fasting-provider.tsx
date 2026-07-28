'use client'

import { useFasting } from '@/hooks/use-fasting'
import { createContext, useContext } from 'react'

const FastingContext = createContext<ReturnType<typeof useFasting> | null>(null)

export const FastingProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const value = useFasting()

  return <FastingContext value={value}>{children}</FastingContext>
}

export function useFastingContext() {
  const context = useContext(FastingContext)

  if (!context)
    throw new Error('useFastingContext must be used within FastingProvider')

  return context
}
