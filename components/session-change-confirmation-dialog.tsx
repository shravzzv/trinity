'use client'

import { Flame, UtensilsCrossed } from 'lucide-react'
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
} from './ui/alert-dialog'
import { formatDuration } from '@/lib/time'
import SessionExceededAlert from './session-exceeded-alert'

interface SessionChangeConfirmationDialogProps {
  open: boolean
  isFasting: boolean
  isAnchored: boolean
  remainingMs: number
  selectedEndedAt: Date | undefined
  hasExceededSessionLength: boolean
  handleSessionChange: () => void
  onOpenChange: (open: boolean) => void
  setIsDrawerOpen: (open: boolean) => void
}

export default function SessionChangeConfirmationDialog({
  open,
  isFasting,
  isAnchored,
  remainingMs,
  selectedEndedAt,
  hasExceededSessionLength,
  onOpenChange,
  setIsDrawerOpen,
  handleSessionChange,
}: SessionChangeConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
          <SessionExceededAlert
            selectedEndedAt={selectedEndedAt}
            openDrawer={() => setIsDrawerOpen(true)}
          />
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSessionChange}>
            {isAnchored ? 'Start' : isFasting ? 'End' : 'Start'} fasting
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
