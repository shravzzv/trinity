'use client'

import type { Fast, FastingPlanId, FastingSession } from '@/types/fasting'
import ActiveFastingTimer from './active-fasting-timer'
import InactiveFastingTimer from './inactive-fasting-timer'
import { type UseFastingResult } from '@/hooks/use-fasting'
import FastingTimerSkeleton from './skeletons/fasting-timer-skeleton'

interface FastingTimerProps {
  isLoading: boolean
  fasts: Fast[]
  planId: FastingPlanId | null
  session: FastingSession | null
  endFasting: (endedAt?: Date) => Promise<void>
  startFasting: (startedAt?: Date) => Promise<void>
  updatePlanId: UseFastingResult['updatePlanId']
  updateSessionStartedAt: (updatedStartedAt: Date) => void
}

export default function FastingTimer({
  planId,
  session,
  isLoading,
  updatePlanId,
  ...rest
}: FastingTimerProps) {
  if (isLoading) return <FastingTimerSkeleton />

  if (!session || !planId) {
    return (
      <InactiveFastingTimer
        hasPlan={planId !== null}
        updatePlanId={updatePlanId}
        startFasting={rest.startFasting}
      />
    )
  }

  return <ActiveFastingTimer {...rest} session={session} planId={planId} />
}
