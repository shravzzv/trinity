'use client'

import type {
  Fast,
  FastingPlanId,
  FastingSession,
  PreferredFastStartTime,
} from '@/types/fasting'
import ActiveFastingTimer from './active-fasting-timer'
import InactiveFastingTimer from './inactive-fasting-timer'
import { type UseFastingResult } from '@/hooks/use-fasting'
import FastingTimerSkeleton from './skeletons/fasting-timer-skeleton'

interface FastingTimerProps {
  fasts: Fast[]
  anchors: number
  isLoading: boolean
  resetStreak: () => void
  spendAnchor: () => void
  incrementStreak: () => void
  planId: FastingPlanId | null
  session: FastingSession | null
  startAnchoredSession: () => void
  endFasting: (endedAt?: Date) => Promise<void>
  updatePlanId: UseFastingResult['updatePlanId']
  startFasting: (startedAt?: Date) => Promise<void>
  preferredFastStartTime: PreferredFastStartTime | null
  updateSessionStartedAt: (updatedStartedAt: Date) => void
}

export default function FastingTimer({
  planId,
  session,
  isLoading,
  updatePlanId,
  preferredFastStartTime,
  ...rest
}: FastingTimerProps) {
  if (isLoading) return <FastingTimerSkeleton />

  if (!session || !planId) {
    return (
      <InactiveFastingTimer
        planId={planId}
        updatePlanId={updatePlanId}
        startFasting={rest.startFasting}
        preferredFastStartTime={preferredFastStartTime}
      />
    )
  }

  return <ActiveFastingTimer {...rest} session={session} planId={planId} />
}
