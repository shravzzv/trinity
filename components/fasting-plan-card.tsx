'use client'

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from './ui/button'
import { Goal, Pen } from 'lucide-react'
import { fastingPlans } from '@/constants/fasting-plans'
import { FastingPlanId } from '@/types/fasting'
import { UseFastingResult } from '@/hooks/use-fasting'
import { pluralize } from '@/lib/strings'
import { toast } from 'sonner'
import FastingPlanDialog from './fasting-plan-dialog'

interface FastingPlanCardProps {
  planId: FastingPlanId | null
  updatePlanId: UseFastingResult['updatePlanId']
}

export default function FastingPlanCard({
  planId,
  updatePlanId,
}: FastingPlanCardProps) {
  const selectedPlan = fastingPlans.find((p) => p.id === planId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting plan</CardTitle>

        <CardAction>
          <FastingPlanDialog
            dialogTitle='Edit your fasting plan'
            dialogDescription=' Update the fasting schedule to match your routine.'
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
          <div className='space-y-2'>
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
    </Card>
  )
}
