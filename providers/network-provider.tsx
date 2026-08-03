'use client'

import { requestSync } from '@/lib/sync'
import { useNetwork } from '@/hooks/use-network'
import { createContext, useContext, useEffect, useRef } from 'react'
import { toast } from 'sonner'

const NetworkContext = createContext<ReturnType<typeof useNetwork> | null>(null)

export const NetworkProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const value = useNetwork()
  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }

    if (value.isOnline) {
      void requestSync()
      toast.success('Back online')
    } else {
      toast.warning('You are offline')
    }
  }, [value.isOnline])

  return <NetworkContext value={value}>{children}</NetworkContext>
}

export const useNetworkContext = () => {
  const context = useContext(NetworkContext)

  if (!context) {
    throw Error('useNetworkContext must be used within NetworkProvider')
  }

  return context
}
