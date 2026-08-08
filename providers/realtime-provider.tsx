'use client'

import { useRealtime } from '@/hooks/use-realtime'

export const RealtimeProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  useRealtime()
  return children
}
