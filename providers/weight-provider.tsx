'use client'

import { useWeight } from '@/hooks/use-weight'
import { createContext, useContext } from 'react'

const WeightContext = createContext<ReturnType<typeof useWeight> | null>(null)

export const WeightProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useWeight()

  return <WeightContext value={value}>{children}</WeightContext>
}

export function useWeightContext() {
  const context = useContext(WeightContext)

  if (!context)
    throw new Error('useWeightContext must be used within WeightProvider')

  return context
}
