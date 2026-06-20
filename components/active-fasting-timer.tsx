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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Flame, UtensilsCrossed } from 'lucide-react'
import { toast } from 'sonner'

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
  const remainingMs = sessionLengthMs - elapsedMs

  // presentation
  const progress = Math.min((elapsedMs / sessionLengthMs) * 100, 100)
  const endsAt = new Date(startedAtMs + sessionLengthMs)

  // excess
  const hasExceededSessionLength = remainingMs < 0
  const excessMs = elapsedMs - sessionLengthMs

  const handleContinue = () => {
    if (isFasting) {
      endFasting()
      toast.success('Fast ended')
    } else {
      startFasting()
      toast.success('Fast started')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting timer</CardTitle>

        <CardDescription>
          <Badge aria-label='fasting-status'>
            {isFasting ? 'Fasting' : 'Eating'}
          </Badge>
        </CardDescription>

        <CardAction>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>{isFasting ? 'End' : 'Start'} fasting</Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  {isFasting ? <UtensilsCrossed /> : <Flame />}
                </AlertDialogMedia>

                <AlertDialogTitle>
                  {isFasting ? 'End' : 'Start'} fasting session?
                </AlertDialogTitle>

                <AlertDialogDescription className='flex flex-col gap-1 space-y-2'>
                  <span>
                    {isFasting
                      ? 'This will end your current fasting session and start your eating window.'
                      : 'This will end your current eating window and start a new fasting session.'}
                  </span>

                  {remainingMs > 0 && (
                    <span className='font-medium'>
                      {formatDuration(remainingMs)} remaining.
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction onClick={handleContinue}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold' aria-label='fasting-timer'>
            {hasExceededSessionLength
              ? `+${formatDuration(excessMs)}`
              : formatDuration(remainingMs)}
          </h1>

          <p className='text-muted-foreground text-sm'>
            {hasExceededSessionLength ? 'Goal reached' : 'Ends'} at{' '}
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
