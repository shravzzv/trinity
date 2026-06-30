'use client'

import type { FastingPlanId, FastingSession } from '@/types/fasting'
import ActiveFastingTimer from './active-fasting-timer'
import InactiveFastingTimer from './inactive-fasting-timer'
import { type UseFastingResult } from '@/hooks/use-fasting'
import FastingTimerSkeleton from './skeletons/fasting-timer-skeleton'

interface FastingTimerProps {
  isLoading: boolean
  planId: FastingPlanId | null
  session: FastingSession | null
  endFasting: () => void
  startFasting: () => void
  updatePlanId: UseFastingResult['updatePlanId']
}

export default function FastingTimer({
  session,
  planId,
  updatePlanId,
  isLoading,
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
