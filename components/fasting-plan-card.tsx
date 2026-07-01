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
import { formatPreferredTime, getPreferredFastSchedule } from '@/lib/fasting'
import PreferredFastTimeDialog from './preferred-fast-time-dialog'

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
  if (isLoading) return <FastingPlanCardSkeleton />

  const selectedPlan = fastingPlans.find((p) => p.id === planId)

  const preferredSchedule =
    preferredFastStartTime && selectedPlan
      ? getPreferredFastSchedule(
          preferredFastStartTime,
          selectedPlan.fastingHours,
        )
      : null

  const handleSave = (hour: number, minute: number) => {
    updatePreferredFastStartTime(hour, minute)
    toast.success('Fasting schedule set')
  }

  const handleUpdate = (hour: number, minute: number) => {
    updatePreferredFastStartTime(hour, minute)
    toast.success('Fasting schedule updated')
  }

  const handleDeleteSchedule = () => {
    clearPreferredFastStartTime()
    toast.success('Fasting schedule deleted')
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

              <PreferredFastTimeDialog
                dialogTitle='Update fasting schedule'
                dialogDescription='Change the time you usually begin your fasting window. Your preferred fasting schedule will be updated automatically.'
                preferredFastStartTime={preferredFastStartTime}
                selectedPlan={selectedPlan}
                allowDeleteSchedule
                onSubmit={handleUpdate}
                onDeleteSchedule={handleDeleteSchedule}
              >
                <Button variant='outline' size='sm'>
                  {formatPreferredTime(preferredSchedule.startsAt)}
                  <Pen />
                </Button>
              </PreferredFastTimeDialog>
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

            <PreferredFastTimeDialog
              dialogTitle='Set fasting schedule'
              dialogDescription='Choose the time you usually begin your fasting window. Trinity will use this to suggest your preferred fasting schedule and prefill fasting start times throughout the app.'
              preferredFastStartTime={preferredFastStartTime}
              onSubmit={handleSave}
              selectedPlan={selectedPlan}
            >
              <Button variant='secondary'>
                <Clock3 />
                Set time
              </Button>
            </PreferredFastTimeDialog>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
