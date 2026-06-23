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
import { ChevronDownIcon, Plus } from 'lucide-react'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Calendar } from './ui/calendar'
import { format } from 'date-fns'
import { Field, FieldGroup, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Separator } from './ui/separator'

export default function AddFastDialog() {
  const [open, setOpen] = useState(false)
  const [startDatePopoverOpen, setStartDatePopoverOpen] = useState(false)
  const [endDatePopoverOpen, setEndDatePopoverOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const handleContinue = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button variant='secondary'>
          <Plus />
          Add fast
        </Button>
      </DialogTrigger>

      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
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
                  {startDate ? format(startDate, 'PP') : 'Select date'}
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
                  selected={startDate}
                  defaultMonth={startDate}
                  onSelect={(date) => {
                    setStartDate(date)
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
              defaultValue='18:00:00'
              className='appearance-none pr-0 outline [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
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
                  {endDate ? format(endDate, 'PP') : 'Select date'}
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
                  selected={endDate}
                  defaultMonth={endDate}
                  onSelect={(date) => {
                    setEndDate(date)
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
              defaultValue='17:30:00'
              className='appearance-none pr-0 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
            />
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Close
            </Button>
          </DialogClose>

          <Button onClick={handleContinue}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
