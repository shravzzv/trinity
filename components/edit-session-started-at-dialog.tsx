'use client'

import { AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { FieldDescription, FieldGroup } from './ui/field'
import DateTimeField from './date-time-field'
import { Alert, AlertTitle } from './ui/alert'
import type { Fast } from '@/types/fasting'
import { useState } from 'react'
import { formatRelativeDay } from '@/lib/time'
import { getSessionStartedAtValidationErrors } from '@/lib/fasting'

interface EditSessionStartedAtDialogProps {
  startedAt: Date
  sessionLengthMs: number
  fastsForValidation: Fast[]
  children?: React.ReactNode
  onSave: (startedAt: Date) => void
}

export default function EditSessionStartedAtDialog({
  children,
  startedAt,
  onSave,
  fastsForValidation,
  sessionLengthMs,
}: EditSessionStartedAtDialogProps) {
  const [draftStartedAt, setDraftStartedAt] = useState(startedAt)
  const [showErrors, setShowErrors] = useState(false)
  const [open, setOpen] = useState(false)

  const isDirty = draftStartedAt.getTime() !== startedAt.getTime()
  const draftEndsAt = new Date(draftStartedAt.getTime() + sessionLengthMs)

  const errors = getSessionStartedAtValidationErrors(
    draftStartedAt,
    fastsForValidation,
  )

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)

    if (nextOpen) {
      setDraftStartedAt(new Date(startedAt))
      setShowErrors(false)
    }
  }

  const handleSave = () => {
    setShowErrors(true)
    if (errors.length > 0) return
    onSave(draftStartedAt)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit session started time</DialogTitle>
          <DialogDescription>
            Adjust when this session actually began. The timer, progress, and
            expected end time will update automatically.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <DateTimeField
            label='Started'
            autoFocus
            value={draftStartedAt}
            onChange={setDraftStartedAt}
            disableFutureDates
          />

          <FieldDescription>
            Expected end time:{' '}
            <span className='font-medium'>
              {draftEndsAt.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>{' '}
            {formatRelativeDay(draftEndsAt)}.
          </FieldDescription>
        </FieldGroup>

        {showErrors && errors.length > 0 && (
          <Alert variant='destructive'>
            <AlertCircle />
            <AlertTitle>Unable to save</AlertTitle>

            <ul className='my-1 list-disc space-y-1 text-sm'>
              {errors.map((error) => (
                <li key={error} className=''>
                  {error}
                </li>
              ))}
            </ul>
          </Alert>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>

          <Button onClick={handleSave} disabled={!isDirty}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
