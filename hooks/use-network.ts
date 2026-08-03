'use client'

import { useEffect, useState } from 'react'

/**
 * The current network connectivity state.
 */
interface UseNetworkResult {
  /**
   * Whether the browser currently has network connectivity.
   */
  isOnline: boolean
}

/**
 * Tracks the browser's current network connectivity.
 *
 * The hook subscribes to the browser's `online` and `offline` events and
 * exposes a reactive connectivity state that updates automatically whenever
 * the browser gains or loses network access.
 *
 * @returns The current network connectivity state.
 */
export const useNetwork = (): UseNetworkResult => {
  /**
   * Returns the browser's initial connectivity state.
   */
  const getInitialOnlineState = () => navigator.onLine

  const [isOnline, setIsOnline] = useState(getInitialOnlineState)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return {
    isOnline,
  }
}
