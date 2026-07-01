'use client'

import { useEffect, useState } from 'react'
import { fastingPlans } from '@/constants/fasting-plans'
import { formatDuration, formatRelativeDay } from '@/lib/time'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import type { Fast, FastingPlanId, FastingSession } from '@/types/fasting'
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
import { Flame, Pen, UtensilsCrossed } from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from './ui/separator'
import EditSessionStartedAtDialog from './edit-session-started-at-dialog'

interface ActiveFastingTimerProps {
  fasts: Fast[]
  planId: FastingPlanId
  session: FastingSession
  endFasting: () => Promise<void>
  startFasting: () => Promise<void>
  updateSessionStartedAt: (updatedStartedAt: Date) => void
}

export default function ActiveFastingTimer({
  fasts,
  planId,
  endFasting,
  startFasting,
  updateSessionStartedAt,
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

  const endsAtFormatted = endsAt.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })

  const startedAtFormatted = new Date(startedAt).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })

  const handleSessionChange = async () => {
    try {
      if (isFasting) {
        await endFasting()
        toast.success('Fast ended')
      } else {
        await startFasting()
        toast.success('Fast started')
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  const handleSessionStartedAtUpdate = (updatedStartedAt: Date) => {
    updateSessionStartedAt(updatedStartedAt)
    toast.success('Session updated')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting timer</CardTitle>

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
                <AlertDialogAction onClick={handleSessionChange}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='flex items-center justify-center gap-2 font-medium'>
          {isFasting ? (
            <Flame className='size-4' />
          ) : (
            <UtensilsCrossed className='size-4' />
          )}

          <p>{isFasting ? 'Fasting' : 'Eating'}</p>
        </div>

        <h1
          className='flex-1 text-center text-3xl font-bold'
          aria-label='fasting-timer'
        >
          {hasExceededSessionLength
            ? `+${formatDuration(excessMs)}`
            : formatDuration(remainingMs)}
        </h1>

        <Progress value={progress} />
      </CardContent>

      <Separator />

      <CardFooter className='flex flex-col items-stretch gap-4'>
        <div className='flex w-full items-center justify-evenly'>
          <div className='flex flex-1 flex-col items-center gap-1'>
            <p className='text-muted-foreground text-xs'>Started</p>

            <EditSessionStartedAtDialog
              fastsForValidation={fasts}
              startedAt={new Date(startedAt)}
              sessionLengthMs={sessionLengthMs}
              onSave={handleSessionStartedAtUpdate}
            >
              <Button variant='outline' size='sm' className='font-medium'>
                {startedAtFormatted}
                <Pen />
              </Button>
            </EditSessionStartedAtDialog>

            <p className='text-muted-foreground text-xs'>
              {formatRelativeDay(new Date(startedAt))}
            </p>
          </div>

          <Separator orientation='vertical' />

          <div className='flex flex-1 flex-col items-center gap-1'>
            <p className='text-muted-foreground text-xs'>
              {hasExceededSessionLength ? 'Goal reached at' : 'Ends'}
            </p>
            <p className='font-medium'>{endsAtFormatted}</p>
            <p className='text-muted-foreground text-xs'>
              {formatRelativeDay(endsAt)}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
