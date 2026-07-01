'use client'

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from './ui/button'
import { Clock3, Goal, Pen } from 'lucide-react'
import { fastingPlans } from '@/constants/fasting-plans'
import type { FastingPlanId, PreferredFastStartTime } from '@/types/fasting'
import { UseFastingResult } from '@/hooks/use-fasting'
import { pluralize } from '@/lib/strings'
import { toast } from 'sonner'
import FastingPlanDialog from './fasting-plan-dialog'
import FastingPlanCardSkeleton from './skeletons/fasting-plan-card-skeleton'
import { Separator } from './ui/separator'
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
import { Field, FieldDescription, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { useState } from 'react'
import { formatPreferredTime, getPreferredFastSchedule } from '@/lib/fasting'

interface FastingPlanCardProps {
  isLoading: boolean
  planId: FastingPlanId | null
  updatePlanId: UseFastingResult['updatePlanId']
  preferredFastStartTime: PreferredFastStartTime | null
  updatePreferredFastStartTime: (hour: number, minute: number) => void
  clearPreferredFastStartTime: () => void
}

export default function FastingPlanCard({
  planId,
  isLoading,
  updatePlanId,
  preferredFastStartTime,
  updatePreferredFastStartTime,
  clearPreferredFastStartTime,
}: FastingPlanCardProps) {
  const [draftTime, setDraftTime] = useState('18:00')

  if (isLoading) return <FastingPlanCardSkeleton />

  const selectedPlan = fastingPlans.find((p) => p.id === planId)

  const [draftHour, draftMinute] = draftTime.split(':').map(Number)

  const draftSchedule = selectedPlan
    ? getPreferredFastSchedule(
        {
          hour: draftHour,
          minute: draftMinute,
        },
        selectedPlan.fastingHours,
      )
    : null

  const preferredSchedule =
    preferredFastStartTime && selectedPlan
      ? getPreferredFastSchedule(
          preferredFastStartTime,
          selectedPlan.fastingHours,
        )
      : null

  const handleSave = () => {
    const [hour, minute] = draftTime.split(':').map(Number)
    updatePreferredFastStartTime(hour, minute)
    toast.success('Fasting schedule set')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting plan</CardTitle>

        <CardAction>
          <FastingPlanDialog
            dialogTitle={`${planId ? 'Edit' : 'Select'} your fasting plan`}
            dialogDescription={
              planId
                ? 'Choose the fasting schedule that best matches your current routine.'
                : 'Choose the fasting schedule that best matches your routine. You can change it later at any time.'
            }
            selectedPlanId={planId}
            allowClose={!!planId}
            onSubmit={(selectedPlanId) => {
              updatePlanId(selectedPlanId)
              toast.success('Fasting plan updated')
            }}
          >
            {planId ? (
              <Button variant='outline'>
                <Pen />
                Edit
              </Button>
            ) : (
              <Button>
                <Goal />
                Select plan
              </Button>
            )}
          </FastingPlanDialog>
        </CardAction>
      </CardHeader>

      <CardContent>
        {planId && selectedPlan ? (
          <div className='flex flex-col items-center justify-center gap-4'>
            <p className='bg-primary text-primary-foreground w-fit rounded-full px-4 py-1 text-xl font-medium'>
              {selectedPlan.title}
            </p>

            <p className='text-muted-foreground text-sm'>
              {pluralize(selectedPlan.fastingHours, 'hour')} fasting with{' '}
              {pluralize(selectedPlan.eatingHours, 'hour')} eating window.
            </p>
          </div>
        ) : (
          <p className='text-muted-foreground text-sm'>
            You haven&apos;t selected a fasting plan yet. You can update it here
            once selected.
          </p>
        )}
      </CardContent>

      <Separator />

      <CardFooter className='flex flex-col items-stretch gap-4'>
        <p className='text-muted-foreground text-center text-sm font-medium'>
          Preferred schedule
        </p>

        {!selectedPlan ? (
          <p className='text-muted-foreground text-sm'>
            A fasting plan is needed to set a preferred schedule.
          </p>
        ) : preferredFastStartTime && preferredSchedule ? (
          <div className='flex w-full items-center justify-evenly'>
            <div className='flex flex-1 flex-col items-center gap-1'>
              <p className='text-muted-foreground text-xs'>Fasting starts</p>

              <div className='flex gap-2'>
                <Button variant='outline' size='sm'>
                  {formatPreferredTime(preferredSchedule.startsAt)}
                  <Pen />
                </Button>
              </div>
            </div>

            <Separator orientation='vertical' />

            <div className='flex flex-1 flex-col items-center gap-1'>
              <p className='text-muted-foreground text-xs'>Eating starts</p>
              <p>{formatPreferredTime(preferredSchedule.endsAt)}</p>

              {preferredSchedule.endsNextDay && (
                <span className='text-muted-foreground text-xs'>next day</span>
              )}
            </div>
          </div>
        ) : (
          <div className='flex w-full items-center justify-between'>
            <p className='text-muted-foreground text-sm'>
              Set your preferred fasting start time.
            </p>

            <Dialog
              onOpenChange={(open) => {
                if (!open) return

                setDraftTime(
                  preferredFastStartTime
                    ? `${String(preferredFastStartTime.hour).padStart(2, '0')}:${String(preferredFastStartTime.minute).padStart(2, '0')}`
                    : '18:00',
                )
              }}
            >
              <DialogTrigger asChild>
                <Button variant='secondary'>
                  <Clock3 />
                  Set time
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set preferred fasting start time</DialogTitle>
                  <DialogDescription>
                    Set the time you usually begin your fasting window. This is
                    used to calculate your preferred fasting schedule and to
                    prefill fasting start times throughout the app.
                  </DialogDescription>
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
                  <DialogClose asChild>
                    <Button variant='outline'>Cancel</Button>
                  </DialogClose>

                  <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
