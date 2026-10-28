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
import { Anchor, Flame, Pen, UtensilsCrossed } from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from './ui/separator'
import EditSessionStartedAtDialog from './edit-session-started-at-dialog'
import EditSessionEndedAtDrawer from './edit-session-ended-at-drawer'
import { getActiveSessionStatistics } from '@/lib/fasting'
import { Badge } from './ui/badge'
import AnchorConfirmationDialog from './anchor-confirmation-dialog'
import { cn } from '@/lib/utils'
import { shouldAwardAnchor } from '@/lib/gamification'
import { xpRewards } from '@/constants/gamification'
import { SUCCESSFUL_FAST_STARTED_AT } from '@/constants/storage-keys'
import SuccessfulFastDialog from './successful-fast-dialog'
import SessionChangeConfirmationDialog from './session-change-confirmation-dialog'

interface ConfirmationSnapshot {
  isFasting: boolean
  isAnchored: boolean
  hasExceededSessionLength: boolean
  remainingMs: number
  selectedEndedAt: Date | undefined
}

interface ActiveFastingTimerProps {
  fasts: Fast[]
  streak: number
  anchors: number
  planId: FastingPlanId
  session: FastingSession
  awardAnchor: () => void
  spendAnchor: () => void
  resetStreak: () => void
  incrementStreak: () => void
  startAnchoredSession: () => void
  awardXp: (amount: number) => void
  showSuccessfulFastDialog: boolean
  endFasting: (endedAt?: Date) => Promise<void>
  startFasting: (startedAt?: Date) => Promise<void>
  setShowSuccessfulFastDialog: (value: boolean) => void
  updateSessionStartedAt: (updatedStartedAt: Date) => void
}

export default function ActiveFastingTimer({
  fasts,
  planId,
  streak,
  anchors,
  awardXp,
  endFasting,
  resetStreak,
  awardAnchor,
  spendAnchor,
  startFasting,
  incrementStreak,
  startAnchoredSession,
  updateSessionStartedAt,
  showSuccessfulFastDialog,
  setShowSuccessfulFastDialog,
  session: { status, startedAt, isAnchored },
}: ActiveFastingTimerProps) {
  const [now, setNow] = useState(() => Date.now())
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedEndedAt, setSelectedEndedAt] = useState<Date | undefined>()
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [confirmationSnapshot, setConfirmationSnapshot] =
    useState<ConfirmationSnapshot | null>(null)

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
    (isFasting && hasExceededSessionLength) || isAnchored
  const shouldResetStreak = isFasting && !shouldIncrementStreak

  const handleSessionChange = async () => {
    try {
      if (isAnchored) {
        await startFasting(selectedEndedAt)

        awardXp(xpRewards.completedAnchoredFast)
        toast.success('Fasting session started')
      } else if (isFasting) {
        if (hasExceededSessionLength) {
          awardXp(xpRewards.completedFast)

          localStorage.setItem(SUCCESSFUL_FAST_STARTED_AT, startedAt)
          setShowSuccessfulFastDialog(true)
        } else {
          awardXp(xpRewards.missedFast)
          toast.success('Fast ended')
        }

        await endFasting(selectedEndedAt)
      } else {
        await startFasting(selectedEndedAt)
        toast.success('Fast started')
      }

      if (shouldIncrementStreak) {
        incrementStreak()

        const nextStreak = streak + 1
        if (shouldAwardAnchor(nextStreak)) awardAnchor()
      }

      if (shouldResetStreak) resetStreak()
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  const handleSessionStartedAtUpdate = (updatedStartedAt: Date) => {
    updateSessionStartedAt(updatedStartedAt)
    toast.success('Session updated')
  }

  const openConfirmationDialog = () => {
    setConfirmationSnapshot({
      isFasting,
      isAnchored,
      remainingMs,
      selectedEndedAt,
      hasExceededSessionLength,
    })

    setShowConfirmationDialog(true)
  }

  const handleConfirmationOpenChange = (open: boolean) => {
    setShowConfirmationDialog(open)
    if (!open) setSelectedEndedAt(undefined)
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
    <>
      <Card className={cn(isAnchored && 'border-primary/30 border')}>
        <CardHeader>
          <CardTitle>Fasting timer</CardTitle>

          <CardAction>
            <Button onClick={openConfirmationDialog}>
              {isAnchored ? 'Start' : isFasting ? 'End' : 'Start'} fasting
            </Button>
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
                anchors={anchors}
                startedAt={startedAt}
                onSubmit={() => {
                  startAnchoredSession()
                  spendAnchor()
                  awardXp(xpRewards.startedAnchoredFast)
                  toast.success('Anchored fasting session started')
                }}
              />
            </div>
          )}

          <div className='flex items-center gap-4'>
            <span
              className='text-muted-foreground text-xs'
              aria-label='elapsed-time'
            >
              {hasExceededSessionLength
                ? formatDuration(sessionLengthMs + excessMs)
                : formatDuration(sessionLengthMs - remainingMs)}
            </span>

            <Progress
              value={progress}
              aria-label={`Current ${status} session progress.`}
              aria-valuetext={`${Math.round(progress)} percent complete`}
            />
          </div>
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

      <SessionChangeConfirmationDialog
        open={showConfirmationDialog}
        onOpenChange={handleConfirmationOpenChange}
        handleSessionChange={handleSessionChange}
        setIsDrawerOpen={setIsDrawerOpen}
        isAnchored={confirmationSnapshot?.isAnchored ?? isAnchored}
        isFasting={confirmationSnapshot?.isFasting ?? isFasting}
        remainingMs={confirmationSnapshot?.remainingMs ?? remainingMs}
        selectedEndedAt={
          confirmationSnapshot?.selectedEndedAt ?? selectedEndedAt
        }
        hasExceededSessionLength={
          confirmationSnapshot?.hasExceededSessionLength ??
          hasExceededSessionLength
        }
      />

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

      <SuccessfulFastDialog
        open={showSuccessfulFastDialog}
        onOpenChange={setShowSuccessfulFastDialog}
      />
    </>
  )
}
