'use client'

import { useEffect, useState } from 'react'
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
import { Anchor, Flame, Pen, UtensilsCrossed } from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from './ui/separator'
import EditSessionStartedAtDialog from './edit-session-started-at-dialog'
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import EditSessionEndedAtDrawer from './edit-session-ended-at-drawer'
import { getActiveSessionStatistics } from '@/lib/fasting'
import { Badge } from './ui/badge'
import AnchorConfirmationDialog from './anchor-confirmation-dialog'
import { cn } from '@/lib/utils'

interface ActiveFastingTimerProps {
  fasts: Fast[]
  planId: FastingPlanId
  session: FastingSession
  resetStreak: () => void
  incrementStreak: () => void
  startAnchoredSession: () => void
  endFasting: (endedAt?: Date) => Promise<void>
  startFasting: (startedAt?: Date) => Promise<void>
  updateSessionStartedAt: (updatedStartedAt: Date) => void
}

export default function ActiveFastingTimer({
  fasts,
  planId,
  endFasting,
  resetStreak,
  startFasting,
  incrementStreak,
  startAnchoredSession,
  updateSessionStartedAt,
  session: { status, startedAt, isAnchored },
}: ActiveFastingTimerProps) {
  const [now, setNow] = useState(() => Date.now())
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedEndedAt, setSelectedEndedAt] = useState<Date | undefined>()

  const {
    endsAt,
    excessMs,
    progress,
    isFasting,
    remainingMs,
    sessionLengthMs,
    endsAtFormatted,
    startedAtFormatted,
    hasExceededSessionLength,
  } = getActiveSessionStatistics({
    now,
    planId,
    status,
    startedAt: new Date(startedAt),
  })

  const shouldIncrementStreak =
    isAnchored || (isFasting && hasExceededSessionLength)

  const handleSessionChange = async () => {
    try {
      if (isAnchored) {
        await startFasting(selectedEndedAt)
        toast.success('Fasting session started')
      } else if (isFasting) {
        await endFasting(selectedEndedAt)
        toast.success('Fast ended')
      } else {
        await startFasting(selectedEndedAt)
        toast.success('Fast started')
      }

      if (shouldIncrementStreak) incrementStreak()
      else if (isFasting) resetStreak()
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  const handleSessionStartedAtUpdate = (updatedStartedAt: Date) => {
    updateSessionStartedAt(updatedStartedAt)
    toast.success('Session updated')
  }

  const handleAlertDialogOpenChange = () => {
    setSelectedEndedAt(undefined)
  }

  /**
   * Update the {@link now} (current time) every second.
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <Card className={cn(isAnchored && 'border-primary/30 border')}>
      <CardHeader>
        <CardTitle>Fasting timer</CardTitle>

        <CardAction>
          <AlertDialog onOpenChange={handleAlertDialogOpenChange}>
            <AlertDialogTrigger asChild>
              <Button>
                {isAnchored ? 'Start' : isFasting ? 'End' : 'Start'} fasting
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  {isAnchored ? (
                    <Flame />
                  ) : isFasting ? (
                    <UtensilsCrossed />
                  ) : (
                    <Flame />
                  )}
                </AlertDialogMedia>

                <AlertDialogTitle>
                  {isAnchored ? 'Start' : isFasting ? 'End' : 'Start'} fasting
                  session?
                </AlertDialogTitle>

                <AlertDialogDescription className='flex flex-col gap-1 space-y-2'>
                  <span>
                    {isAnchored
                      ? 'This will end your current anchored fasting session and start a new fast.'
                      : isFasting
                        ? 'This will end your current fasting session and start your eating window.'
                        : 'This will end your current eating window and start a new fasting session.'}
                  </span>

                  {!hasExceededSessionLength && (
                    <span className='font-medium'>
                      {formatDuration(remainingMs)} remaining.
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>

              {hasExceededSessionLength && (
                <Alert>
                  <AlertTitle>Finished earlier?</AlertTitle>
                  <AlertDescription className='flex flex-col gap-2'>
                    {selectedEndedAt ? (
                      <div>
                        <span>
                          Finish time:{' '}
                          <span className='font-medium'>
                            {selectedEndedAt.toLocaleTimeString()}
                          </span>{' '}
                        </span>

                        <span className='font-medium'>
                          {formatRelativeDay(selectedEndedAt)}.
                        </span>
                      </div>
                    ) : (
                      <span>
                        Update the finish time before continuing. The present
                        time will be used by default if you continue.
                      </span>
                    )}
                  </AlertDescription>

                  <AlertAction>
                    <Button
                      size='xs'
                      variant='outline'
                      onClick={() => setIsDrawerOpen(true)}
                    >
                      Update time
                    </Button>
                  </AlertAction>
                </Alert>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSessionChange}>
                  {isAnchored ? 'Start' : isFasting ? 'End' : 'Start'} fasting
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>

      <CardContent className='space-y-4'>
        {isAnchored ? (
          <div className='border-primary/20 bg-primary/5 mx-auto w-fit space-y-1 rounded-full border px-8 py-3'>
            <div className='flex items-center justify-center gap-2 font-medium'>
              <Anchor className='size-4' />
              <p>Anchor in use</p>
              <Badge variant='outline'>{planId}</Badge>
            </div>

            <p className='text-muted-foreground text-center text-xs'>
              Your streak is protected.
            </p>
          </div>
        ) : (
          <div className='flex items-center justify-center gap-2 font-medium'>
            {isFasting ? (
              <Flame className='size-4' />
            ) : (
              <UtensilsCrossed className='size-4' />
            )}

            <p>{isFasting ? 'Fasting' : 'Eating'}</p>
            <Badge variant='outline'>{planId}</Badge>
          </div>
        )}

        <h1
          className='flex-1 text-center text-4xl font-bold'
          aria-label='fasting-timer'
        >
          {hasExceededSessionLength
            ? `+${formatDuration(excessMs)}`
            : formatDuration(remainingMs)}
        </h1>

        {!isAnchored && isFasting && (
          <div className='flex justify-center'>
            <AnchorConfirmationDialog
              onSubmit={() => {
                startAnchoredSession()
                toast.success('Anchored fasting session started')
              }}
            />
          </div>
        )}

        <Progress
          value={progress}
          aria-label={`Current ${status} session progress.`}
          aria-valuetext={`${Math.round(progress)} percent complete`}
        />
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

      <EditSessionEndedAtDrawer
        open={isDrawerOpen}
        fastsForValidation={fasts}
        onApply={(endedAt) => {
          setSelectedEndedAt(endedAt)
          setIsDrawerOpen(false)
        }}
        onOpenChange={setIsDrawerOpen}
        startedAt={new Date(startedAt)}
        initialEndedAt={selectedEndedAt ?? new Date()}
      />
    </Card>
  )
}
