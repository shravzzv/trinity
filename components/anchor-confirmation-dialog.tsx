'use client'

import { Anchor } from 'lucide-react'
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
} from './ui/alert-dialog'
import { Button } from './ui/button'
import { getNextScheduledFastStartedAt } from '@/lib/fasting'
import { formatRelativeDay } from '@/lib/time'

interface AnchorConfirmationDialogProps {
  anchors: number
  startedAt: string
  onSubmit: () => void
}

export default function AnchorConfirmationDialog({
  anchors,
  onSubmit,
  startedAt,
}: AnchorConfirmationDialogProps) {
  const anchorsAvailable = anchors

  const nextStartedAt = getNextScheduledFastStartedAt(new Date(startedAt))
  const nextStartedAtRelativeDay = formatRelativeDay(nextStartedAt)
  const nextStartedAtFormatted = nextStartedAt.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='outline' size='sm' disabled={anchorsAvailable === 0}>
          <Anchor />
          {anchorsAvailable > 0 ? 'Use Anchor' : 'No Anchors available'}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Anchor />
          </AlertDialogMedia>
          <AlertDialogTitle>Use an Anchor?</AlertDialogTitle>

          <AlertDialogDescription className='flex flex-col gap-1 space-y-2'>
            <span>
              Your current fasting session will become an{' '}
              <span className='font-medium'>anchored fasting session</span>,
              allowing you to eat while preserving your fasting streak.
            </span>

            <span>
              You can start another fast at any time. Otherwise, your next
              scheduled fasting session begins at{' '}
              <span className='font-medium'>
                {nextStartedAtFormatted} {nextStartedAtRelativeDay}
              </span>
              .
            </span>

            <span>
              This action is <span className='font-medium'>irreversible</span>.
              After use, you&apos;ll have{' '}
              <span className='font-medium'>
                {anchorsAvailable - 1} Anchors remaining
              </span>
              .
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={onSubmit}>Use Anchor</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
