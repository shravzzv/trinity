'use client'

import type { FastingPlanId, FastingSession } from '@/types/fasting'
import ActiveFastingTimer from './active-fasting-timer'
import InactiveFastingTimer from './inactive-fasting-timer'

interface FastingTimerProps {
  planId: FastingPlanId
  session: FastingSession | null
  endFasting: () => void
  startFasting: () => void
}

export default function FastingTimer({ session, ...rest }: FastingTimerProps) {
  if (!session) {
    return <InactiveFastingTimer startFasting={rest.startFasting} />
  }

  return <ActiveFastingTimer {...rest} session={session} />
}
