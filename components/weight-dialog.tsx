'use client'

import { ChevronDownIcon } from 'lucide-react'
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
import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from './ui/input-group'
import { MAX_TARGET_WEIGHT_KG, MIN_TARGET_WEIGHT_KG } from '@/constants/weight'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { format } from 'date-fns'
import { Calendar } from './ui/calendar'
import { useState } from 'react'

interface WeightDialogProps {
  /**
   * Title displayed at the top of the dialog.
   */
  dialogTitle: string

  /**
   * Supporting description displayed below the dialog title.
   */
  dialogDescription: string

  /**
   * Label displayed on the submit button.
   */
  submitLabel: string

  /**
   * Called after the entered weight passes validation and the
   * user submits the form.
   */
  onSave: (weightKg: number, recordedAt: Date) => void

  /**
   * Initial weight displayed when the dialog opens.
   *
   * Omit to start with an empty weight field.
   */
  initialWeight?: number

  /**
   * Initial recording date displayed when the dialog opens.
   *
   * Defaults to the current date.
   */
  initialRecordedAt?: Date

  /**
   * Interactive element that opens the dialog.
   *
   * Rendered as the dialog trigger.
   */
  children: React.ReactNode
}

export default function WeightDialog({
  dialogTitle,
  dialogDescription,
  submitLabel,
  initialWeight,
  initialRecordedAt,
  children,
  onSave,
}: WeightDialogProps) {
  const [weight, setWeight] = useState<number | null>(initialWeight ?? null)
  const [recordedAt, setRecordedAt] = useState<Date>(
    initialRecordedAt ?? new Date(),
  )
  const [isRecordedAtPopoverOpen, setIsRecordedAtPopoverOpen] = useState(false)
  const [open, setOpen] = useState(false)

  const isValidWeight =
    weight !== null &&
    Number.isFinite(weight) &&
    weight >= MIN_TARGET_WEIGHT_KG &&
    weight <= MAX_TARGET_WEIGHT_KG

  const hasInvalidWeight = weight !== null && !isValidWeight

  const handleSave = () => {
    if (!isValidWeight || weight === null) return

    onSave(weight, recordedAt)
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)

        if (open) {
          setWeight(initialWeight ?? null)
          setRecordedAt(initialRecordedAt ?? new Date())
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <FieldGroup className='flex flex-row'>
          <Field data-invalid={hasInvalidWeight}>
            <FieldLabel htmlFor='weight'>Weight</FieldLabel>

            <InputGroup>
              <InputGroupInput
                id='weight'
                type='number'
                step={0.1}
                min={MIN_TARGET_WEIGHT_KG}
                max={MAX_TARGET_WEIGHT_KG}
                placeholder='Weight'
                autoFocus
                aria-invalid={hasInvalidWeight}
                value={weight ?? ''}
                onChange={(e) =>
                  setWeight(
                    e.target.value === '' ? null : Number(e.target.value),
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSave()
                  }
                }}
              />

              <InputGroupAddon align='inline-end'>
                <InputGroupText>kg</InputGroupText>
              </InputGroupAddon>
            </InputGroup>

            {hasInvalidWeight && (
              <FieldDescription
                className={cn(!isValidWeight && 'text-destructive')}
              >
                Weight must be between {MIN_TARGET_WEIGHT_KG} and{' '}
                {MAX_TARGET_WEIGHT_KG} kg.
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor='recordedAt'>Date</FieldLabel>

            <Popover
              open={isRecordedAtPopoverOpen}
              onOpenChange={setIsRecordedAtPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  id='start-date-picker'
                  className='justify-between font-normal'
                >
                  {format(recordedAt, 'PP')}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className='w-auto overflow-hidden p-0'
                align='start'
              >
                <Calendar
                  mode='single'
                  selected={recordedAt}
                  onSelect={(date) => {
                    if (!date) return
                    setRecordedAt(date)
                    setIsRecordedAtPopoverOpen(false)
                  }}
                  disabled={{ after: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' type='button'>
              Close
            </Button>
          </DialogClose>

          <Button disabled={!isValidWeight} onClick={handleSave}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
