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

interface AnchorConfirmationDialogProps {
  onSubmit: () => void
}

export default function AnchorConfirmationDialog({
  onSubmit,
}: AnchorConfirmationDialogProps) {
  const anchorsAvailable: number = 1

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
              <span className='font-medium'>6:00 p.m. tomorrow</span> after the
              next eating window.
            </span>

            <span>
              This action is <span className='font-medium'>irreversible</span>.
              After use, you&apos;ll have{' '}
              <span className='font-medium'>0 Anchors remaining</span>.
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
