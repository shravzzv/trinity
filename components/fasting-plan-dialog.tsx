'use client'

import React, { useState } from 'react'
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
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import type { FastingPlanId } from '@/types/fasting'
import { fastingPlans } from '@/constants/fasting-plans'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from './ui/field'
import { pluralize } from '@/lib/strings'
import { Button } from './ui/button'

interface FastingPlanDialogProps {
  /**
   * Interactive element that opens the dialog.
   *
   * Rendered as the dialog trigger.
   */
  children?: React.ReactNode

  /**
   * Title displayed at the top of the dialog.
   */
  dialogTitle: string

  /**
   * Supporting description displayed below the dialog title.
   */
  dialogDescription: string

  /**
   * Currently selected fasting plan.
   *
   * Used to initialize the dialog each time it opens.
   * Pass `null` when no plan has been selected yet.
   */
  selectedPlanId: FastingPlanId | null

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
   * Called after the user selects a fasting plan and saves.
   */
  onSubmit: (selectedPlanId: NonNullable<FastingPlanId>) => void

  /**
   * Whether the dialog can be dismissed without selecting a plan.
   *
   * Disable this during first-time onboarding to require the
   * user to choose a fasting plan before continuing.
   *
   * Defaults to `false`.
   */
  allowClose?: boolean
}

export default function FastingPlanDialog({
  children,
  dialogTitle,
  dialogDescription,
  selectedPlanId,
  open,
  allowClose = false,
  onOpenChange,
  onSubmit,
}: FastingPlanDialogProps) {
  const [draftPlanId, setDraftPlanId] = useState<FastingPlanId | null>(
    selectedPlanId,
  )
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = open !== undefined && onOpenChange !== undefined
  const dialogOpen = isControlled ? open : internalOpen

  const setDialogOpen = (next: boolean) => {
    if (isControlled) onOpenChange?.(next)
    else setInternalOpen(next)
  }

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
    setDraftPlanId(selectedPlanId)
  }

  const handleSave = () => {
    if (!draftPlanId) return

    setDialogOpen(false)
    onSubmit(draftPlanId)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent showCloseButton={allowClose}>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={draftPlanId}
          onValueChange={(v) => setDraftPlanId(v as FastingPlanId)}
          className='max-h-[50vh] max-w-sm overflow-y-auto'
        >
          {fastingPlans.map((fastingPlan) => (
            <div key={fastingPlan.id}>
              <FieldLabel htmlFor={fastingPlan.id}>
                <Field orientation='horizontal'>
                  <FieldContent>
                    <FieldTitle>{fastingPlan.title}</FieldTitle>

                    <FieldDescription>
                      {pluralize(fastingPlan.fastingHours, 'hour')} fasting with{' '}
                      {pluralize(fastingPlan.eatingHours, 'hour')} eating
                      window.
                    </FieldDescription>
                  </FieldContent>

                  <RadioGroupItem id={fastingPlan.id} value={fastingPlan.id} />
                </Field>
              </FieldLabel>
            </div>
          ))}
        </RadioGroup>

        <DialogFooter>
          {allowClose && (
            <DialogClose asChild>
              <Button variant='outline'>Close</Button>
            </DialogClose>
          )}

          <Button
            onClick={handleSave}
            disabled={selectedPlanId === draftPlanId || draftPlanId === null}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
