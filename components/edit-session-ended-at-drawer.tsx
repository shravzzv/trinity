'use client'

import { formatDuration } from '@/lib/time'
import DateTimeField from './date-time-field'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './ui/drawer'
import { FieldDescription } from './ui/field'
import { Button } from './ui/button'
import { useState } from 'react'
import { getSessionEndedAtValidationErrors } from '@/lib/fasting'
import type { Fast } from '@/types/fasting'
import { Alert, AlertTitle } from './ui/alert'
import { AlertCircle } from 'lucide-react'

interface EditSessionEndedAtDrawerProps {
  open: boolean
  startedAt: Date
  initialEndedAt: Date
  onApply: (endedAt: Date) => void
  onOpenChange: (open: boolean) => void
  fastsForValidation: Fast[]
}

export default function EditSessionEndedAtDrawer({
  open,
  onApply,
  startedAt,
  onOpenChange,
  initialEndedAt,
  fastsForValidation,
}: EditSessionEndedAtDrawerProps) {
  const [draftEndedAt, setDraftEndedAt] = useState(initialEndedAt)
  const [showErrors, setShowErrors] = useState(false)

  const isDirty = draftEndedAt.getTime() !== initialEndedAt.getTime()
  const errors = getSessionEndedAtValidationErrors(
    startedAt,
    draftEndedAt,
    fastsForValidation,
  )

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
    setDraftEndedAt(new Date(initialEndedAt))
    setShowErrors(false)
  }

  const handleApply = () => {
    setShowErrors(true)
    if (errors.length > 0) return
    onApply(draftEndedAt)
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Adjust finish time</DrawerTitle>
          <DrawerDescription>
            Correct when this session actually finished.
          </DrawerDescription>
        </DrawerHeader>

        <div className='mx-auto max-w-xl space-y-4 px-6'>
          <DateTimeField
            label='Finished'
            disableFutureDates
            value={draftEndedAt}
            onChange={setDraftEndedAt}
          />

          <FieldDescription>
            Resulting session duration:{' '}
            <span className='font-medium'>
              {formatDuration(draftEndedAt.getTime() - startedAt.getTime())}
            </span>
          </FieldDescription>

          {showErrors && errors.length > 0 && (
            <Alert variant='destructive'>
              <AlertCircle />
              <AlertTitle>Unable to apply</AlertTitle>

              <ul className='my-1 list-disc space-y-1 text-sm'>
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}
        </div>

        <DrawerFooter className='max-w-xl md:mx-auto md:min-w-xs'>
          <Button
            onClick={handleApply}
            disabled={!isDirty || (showErrors && errors.length > 0)}
          >
            Apply
          </Button>

          <DrawerClose asChild>
            <Button variant='outline' className='w-full'>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
