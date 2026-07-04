'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { AlertCircle } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Separator } from './ui/separator'
import { Alert, AlertTitle } from '@/components/ui/alert'
import type { Fast } from '@/types/fasting'
import { getFastValidationErrors } from '@/lib/fasting'
import DateTimeField from './date-time-field'

interface FastDialogProps {
  /**
   * Existing fasts used for overlap validation.
   *
   * When editing a fast, pass all fasts except the fast currently being edited.
   */
  existingFasts: Fast[]

  /**
   * Title displayed at the top of the dialog.
   */
  dialogTitle: string

  /**
   * Supporting description displayed below the dialog title.
   */
  dialogDescription: string

  /**
   * Initial start time shown when the dialog opens.
   *
   * When omitted, a sensible default is used.
   */
  initialStartedAt?: Date

  /**
   * Initial end time shown when the dialog opens.
   *
   * When omitted, a sensible default is used.
   */
  initialEndedAt?: Date

  /**
   * Label displayed on the submit button.
   */
  submitLabel: string

  /**
   * Called after validation succeeds.
   */
  onSubmit: (startedAt: Date, endedAt: Date) => void

  /**
   * Controls whether the dialog is open.
   *
   * If omitted, the dialog manages its own open state.
   */
  open?: boolean

  /**
   * Called whenever the dialog requests that its open state changes.
   *
   * Used when the dialog is controlled externally.
   */
  onOpenChange?: (open: boolean) => void

  /**
   * Interactive element that opens the dialog.
   *
   * Rendered as the dialog trigger.
   */
  children?: React.ReactNode
}

export default function FastDialog({
  existingFasts,
  dialogTitle,
  dialogDescription,
  initialStartedAt,
  initialEndedAt,
  submitLabel,
  onSubmit,
  open,
  onOpenChange,
  children,
}: FastDialogProps) {
  const [showErrors, setShowErrors] = useState(false)
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = open !== undefined && onOpenChange !== undefined
  const dialogOpen = isControlled ? open : internalOpen

  const setDialogOpen = (next: boolean) => {
    if (isControlled) onOpenChange?.(next)
    else setInternalOpen(next)
  }

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
    resetForm()
    setShowErrors(false)
  }

  const getDefaultStartedAt = useCallback(() => {
    if (initialStartedAt) return new Date(initialStartedAt)

    const date = new Date()
    date.setDate(date.getDate() - 1)
    date.setHours(18, 0, 0)
    return date
  }, [initialStartedAt])

  const getDefaultEndedAt = useCallback(() => {
    if (initialEndedAt) return new Date(initialEndedAt)

    const date = new Date()
    date.setHours(17, 30, 0)
    return date
  }, [initialEndedAt])

  const [startedAt, setStartedAt] = useState<Date>(getDefaultStartedAt)
  const [endedAt, setEndedAt] = useState<Date>(getDefaultEndedAt)

  const errors = getFastValidationErrors(startedAt, endedAt, existingFasts)

  const resetForm = () => {
    setStartedAt(getDefaultStartedAt())
    setEndedAt(getDefaultEndedAt())
  }

  const handleContinue = () => {
    setShowErrors(true)
    if (errors.length !== 0) return

    setDialogOpen(false)
    onSubmit(startedAt, endedAt)
    setShowErrors(false)
    resetForm()
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <DateTimeField
          label='Start'
          value={startedAt}
          disableFutureDates
          onChange={setStartedAt}
        />

        <Separator />

        <DateTimeField
          label='End'
          value={endedAt}
          onChange={setEndedAt}
          autoFocus
          disableFutureDates
        />

        {showErrors && errors.length > 0 && (
          <Alert variant='destructive'>
            <AlertCircle />
            <AlertTitle>Unable to {submitLabel.toLowerCase()}</AlertTitle>

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
            <Button type='button' variant='outline'>
              Close
            </Button>
          </DialogClose>

          <Button
            onClick={handleContinue}
            disabled={showErrors && errors.length > 0}
            className='disabled:cursor-not-allowed'
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
