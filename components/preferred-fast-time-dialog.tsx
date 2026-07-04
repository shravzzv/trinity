'use client'

import { useState } from 'react'
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
import { Field, FieldDescription, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { formatPreferredTime, getPreferredFastSchedule } from '@/lib/fasting'
import { Button } from './ui/button'
import { FastingPlan, PreferredFastStartTime } from '@/types/fasting'

interface PreferredFastTimeDialogProps {
  /**
   * Optional trigger element used to open the dialog.
   *
   * When omitted, the dialog must be controlled externally.
   */
  children?: React.ReactNode

  /**
   * Whether the delete schedule action should be shown.
   */
  allowDeleteSchedule?: boolean

  /**
   * The dialog title.
   */
  dialogTitle: string

  /**
   * Additional guidance shown beneath the dialog title.
   */
  dialogDescription: string

  /**
   * The currently selected fasting plan.
   *
   * Used to preview when the eating window begins.
   */
  selectedPlan: FastingPlan

  /**
   * The user's current preferred fasting start time.
   *
   * Used to initialize the dialog when editing an existing schedule.
   */
  preferredFastStartTime: PreferredFastStartTime | null

  /**
   * Called when the preferred fasting start time is saved.
   *
   * @param hour The selected hour in 24-hour time.
   * @param minute The selected minute.
   */
  onSubmit: (hour: number, minute: number) => void

  /**
   * Called when the preferred schedule is deleted.
   */
  onDeleteSchedule?: () => void

  /**
   * Controls whether the dialog is open.
   */
  open?: boolean

  /**
   * Called whenever the dialog's open state changes.
   *
   * Required when using the dialog in controlled mode.
   *
   * @param open Whether the dialog is open.
   */
  onOpenChange?: (open: boolean) => void
}

export default function PreferredFastTimeDialog({
  children,
  open,
  dialogTitle,
  selectedPlan,
  dialogDescription,
  allowDeleteSchedule,
  preferredFastStartTime,
  onSubmit,
  onOpenChange,
  onDeleteSchedule,
}: PreferredFastTimeDialogProps) {
  const [draftTime, setDraftTime] = useState('')
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = open !== undefined && onOpenChange !== undefined
  const dialogOpen = isControlled ? open : internalOpen

  const setDialogOpen = (open: boolean) => {
    if (isControlled) onOpenChange(open)
    else setInternalOpen(open)
  }

  const [draftHour, draftMinute] = draftTime.split(':').map(Number)
  const draftSchedule =
    draftTime === ''
      ? null
      : getPreferredFastSchedule(
          {
            hour: draftHour,
            minute: draftMinute,
          },
          selectedPlan.fastingHours,
        )

  const toInputTime = (time: PreferredFastStartTime) =>
    `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`

  const isDirty =
    draftTime !==
    (preferredFastStartTime ? toInputTime(preferredFastStartTime) : '')

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)

    if (open) {
      setDraftTime(
        preferredFastStartTime
          ? `${String(preferredFastStartTime.hour).padStart(2, '0')}:${String(preferredFastStartTime.minute).padStart(2, '0')}`
          : '18:00',
      )
    }
  }

  const handleSave = () => {
    const [hour, minute] = draftTime.split(':').map(Number)
    onSubmit(hour, minute)
    setDialogOpen(false)
  }

  const handleDeleteSchedule = () => {
    onDeleteSchedule?.()
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor='preferred-start-time'>
            Preferred start time
          </FieldLabel>

          <Input
            id='preferred-start-time'
            placeholder='start time'
            type='time'
            value={draftTime}
            onChange={(e) => setDraftTime(e.target.value)}
          />

          {draftSchedule && (
            <FieldDescription>
              Ends at{' '}
              <span className='font-medium'>
                {formatPreferredTime(draftSchedule.endsAt)}
              </span>
              {draftSchedule.endsNextDay && ' the next day'}.
            </FieldDescription>
          )}
        </Field>

        <DialogFooter>
          {allowDeleteSchedule && (
            <Button
              variant='ghost'
              className='text-destructive'
              onClick={handleDeleteSchedule}
            >
              Delete schedule
            </Button>
          )}

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
