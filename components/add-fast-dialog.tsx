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
import { AlertCircle, ChevronDownIcon, Plus } from 'lucide-react'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Calendar } from './ui/calendar'
import { format } from 'date-fns'
import { Field, FieldGroup, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { Alert, AlertTitle } from '@/components/ui/alert'
import type { Fast } from '@/types/fasting'
import { v4 as uuidv4 } from 'uuid'
import { getFastValidationErrors } from '@/lib/fasting'
import { copyTime, replaceTimeFromInputValue } from '@/lib/time'
import { toast } from 'sonner'

interface AddFastDialogProps {
  fasts: Fast[]
  addFast: (fast: Fast) => void
}

const getDefaultStartedAt = () => {
  const date = new Date()
  date.setHours(18, 0, 0)
  return date
}

const getDefaultEndedAt = () => {
  const date = new Date()
  date.setHours(17, 30, 0)
  return date
}

export default function AddFastDialog({ fasts, addFast }: AddFastDialogProps) {
  const [open, setOpen] = useState(false)
  const [startDatePopoverOpen, setStartDatePopoverOpen] = useState(false)
  const [endDatePopoverOpen, setEndDatePopoverOpen] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [startedAt, setStartedAt] = useState<Date>(getDefaultStartedAt)
  const [endedAt, setEndedAt] = useState<Date>(getDefaultEndedAt)

  const errors = getFastValidationErrors(startedAt, endedAt, fasts)

  const resetForm = () => {
    setStartedAt(getDefaultStartedAt())
    setEndedAt(getDefaultEndedAt())
  }

  const handleContinue = () => {
    setShowErrors(true)
    if (errors.length !== 0) return

    setOpen(false)
    addFast({
      id: uuidv4(),
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
    })
    toast.success('Fast added')
    setShowErrors(false)
    resetForm()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (!open) setShowErrors(false)
      }}
    >
      <DialogTrigger asChild>
        <Button variant='secondary'>
          <Plus />
          Add fast
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add past fast</DialogTitle>

          <DialogDescription>
            Manually add a completed fast to your fasting history. Choose a
            start and end time in the past. To keep your history accurate, fasts
            cannot overlap with existing entries.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className='flex-row'>
          <Field>
            <FieldLabel htmlFor='start-date-picker'>Start date</FieldLabel>
            <Popover
              open={startDatePopoverOpen}
              onOpenChange={setStartDatePopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  id='start-date-picker'
                  className='justify-between font-normal'
                >
                  {format(startedAt, 'PP')}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className='w-auto overflow-hidden p-0'
                align='start'
              >
                <Calendar
                  mode='single'
                  captionLayout='dropdown'
                  selected={startedAt}
                  defaultMonth={startedAt}
                  onSelect={(date) => {
                    if (!date) return
                    setStartedAt(copyTime(date, startedAt))
                    setStartDatePopoverOpen(false)
                  }}
                  disabled={{ after: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </Field>

          <Field>
            <FieldLabel htmlFor='start-time-picker'>Time</FieldLabel>
            <Input
              id='start-time-picker'
              type='time'
              step='1'
              className='appearance-none pr-0 outline [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
              value={format(startedAt, 'HH:mm:ss')}
              onChange={(e) => {
                setStartedAt(
                  replaceTimeFromInputValue(startedAt, e.target.value),
                )
              }}
            />
          </Field>
        </FieldGroup>

        <Separator />

        <FieldGroup className='flex-row'>
          <Field>
            <FieldLabel htmlFor='end-date-picker'>End date</FieldLabel>
            <Popover
              open={endDatePopoverOpen}
              onOpenChange={setEndDatePopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  id='end-date-picker'
                  className='justify-between font-normal'
                >
                  {format(endedAt, 'PP')}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className='w-auto overflow-hidden p-0'
                align='start'
              >
                <Calendar
                  mode='single'
                  captionLayout='dropdown'
                  selected={endedAt}
                  defaultMonth={endedAt}
                  onSelect={(date) => {
                    if (!date) return
                    setEndedAt(copyTime(date, endedAt))
                    setEndDatePopoverOpen(false)
                  }}
                  disabled={{ after: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </Field>

          <Field>
            <FieldLabel htmlFor='end-time-picker'>Time</FieldLabel>
            <Input
              id='end-time-picker'
              type='time'
              step='1'
              className='appearance-none pr-0 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
              value={format(endedAt, 'HH:mm:ss')}
              onChange={(e) => {
                setEndedAt(replaceTimeFromInputValue(endedAt, e.target.value))
              }}
            />
          </Field>
        </FieldGroup>

        {showErrors && errors.length > 0 && (
          <Alert variant='destructive'>
            <AlertCircle />
            <AlertTitle>Unable to add fast </AlertTitle>

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
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
