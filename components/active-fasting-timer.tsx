'use client'

import { useEffect, useState } from 'react'
import { fastingPlans } from '@/constants/fasting-plans'
import { formatDuration } from '@/lib/time'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import type { FastingPlanId, FastingSession } from '@/types/fasting'

interface ActiveFastingTimerProps {
  planId: FastingPlanId
  session: FastingSession
  endFasting: () => void
  startFasting: () => void
}

export default function ActiveFastingTimer({
  planId,
  startFasting,
  endFasting,
  session: { status, startedAt },
}: ActiveFastingTimerProps) {
  const [now, setNow] = useState(() => Date.now())

  /**
   * Update the {@link now} (current time) every second.
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const isFasting = status === 'fasting'
  const fastingPlan =
    fastingPlans.find((p) => p.id === planId) ?? fastingPlans[0]

  // session duration
  const sessionLengthHours: number = isFasting
    ? fastingPlan.fastingHours
    : fastingPlan.eatingHours
  const sessionLengthMs = sessionLengthHours * 60 * 60 * 1000

  // timeline
  const startedAtMs = new Date(startedAt).getTime()
  const elapsedMs = now - startedAtMs
  const remainingMs = Math.max(sessionLengthMs - elapsedMs, 0)

  // presentation
  const progress = Math.min((elapsedMs / sessionLengthMs) * 100, 100)
  const endsAt = new Date(startedAtMs + sessionLengthMs)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting timer</CardTitle>

        <CardDescription>
          <Badge>{isFasting ? 'Fasting' : 'Eating'}</Badge>
        </CardDescription>

        <CardAction>
          <Button onClick={() => (isFasting ? endFasting() : startFasting())}>
            {isFasting ? 'End' : 'Start'} fasting
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>{formatDuration(remainingMs)}</h1>
          <p className='text-muted-foreground text-sm'>
            Ends at{' '}
            {endsAt.toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
        </div>

        <Progress value={progress} />
      </CardContent>
    </Card>
  )
}
