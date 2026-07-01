'use client'

import { useId, useState } from 'react'
import { Field, FieldGroup, FieldLabel } from './ui/field'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { format } from 'date-fns'
import { ChevronDown } from 'lucide-react'
import { Calendar } from './ui/calendar'
import { Input } from './ui/input'
import { copyTime, replaceTimeFromInputValue, toInputTime } from '@/lib/time'

interface DateTimeFieldProps {
  /**
   * The currently selected date and time.
   */
  value: Date

  /**
   * The field label used for both the date and time inputs.
   *
   * Labels show up as `label-date` and `label-time` for the date
   * and time fields respectively.
   */
  label: string

  /**
   * Whether the time input should receive focus when mounted.
   */
  autoFocus?: boolean

  /**
   * Whether dates after today should be disabled in the calendar.
   */
  disableFutureDates?: boolean

  /**
   * Called whenever the selected date or time changes.
   * The returned date always contains both the updated date and time.
   *
   * @param date The updated date and time.
   */
  onChange: (date: Date) => void
}

export default function DateTimeField({
  value,
  label,
  onChange,
  autoFocus,
  disableFutureDates,
}: DateTimeFieldProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const id = useId()
  const dateId = `${id}-date`
  const timeId = `${id}-time`

  return (
    <FieldGroup className='flex-row'>
      <Field>
        <FieldLabel htmlFor={dateId}>{label} date</FieldLabel>

        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              id={dateId}
              variant='outline'
              className='justify-between font-normal'
            >
              {format(value, 'PP')}
              <ChevronDown />
            </Button>
          </PopoverTrigger>

          <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
            <Calendar
              mode='single'
              captionLayout='dropdown'
              selected={value}
              defaultMonth={value}
              onSelect={(date) => {
                if (!date) return
                onChange(copyTime(date, value))
                setPopoverOpen(false)
              }}
              disabled={disableFutureDates && { after: new Date() }}
            />
          </PopoverContent>
        </Popover>
      </Field>

      <Field>
        <FieldLabel htmlFor={timeId}>{label} time</FieldLabel>

        <Input
          type='time'
          id={timeId}
          autoFocus={autoFocus}
          value={toInputTime(value)}
          onChange={(e) => {
            onChange(replaceTimeFromInputValue(value, e.target.value))
          }}
        />
      </Field>
    </FieldGroup>
  )
}
