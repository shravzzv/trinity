'use client'

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from './ui/button'
import { Pen } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'
import { fastingPlans } from '@/constants/fasting-plans'
import { FastingPlanId } from '@/types/fasting'
import { UseFastingResult } from '@/hooks/use-fasting'
import { pluralize } from '@/lib/utils'

interface FastingPlanCardProps {
  planId: FastingPlanId
  updatePlanId: UseFastingResult['updatePlanId']
}

export default function FastingPlanCard({
  planId,
  updatePlanId,
}: FastingPlanCardProps) {
  const [draftPlanId, setDraftPlanId] = useState<FastingPlanId>(planId)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const selectedPlan =
    fastingPlans.find((p) => p.id === planId) ?? fastingPlans[0]

  const handleSave = () => {
    updatePlanId(draftPlanId)
    setIsDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting plan</CardTitle>

        <CardAction>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (open) setDraftPlanId(planId)
              setIsDialogOpen(open)
            }}
          >
            <DialogTrigger asChild>
              <Button variant='outline'>
                <Pen />
                Edit
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select your fasting plan</DialogTitle>
                <DialogDescription>
                  Choose the fasting schedule that best matches your routine.
                </DialogDescription>
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
                            {pluralize(fastingPlan.fastingHours, 'hour')}{' '}
                            fasting with{' '}
                            {pluralize(fastingPlan.eatingHours, 'hour')} eating
                            window.
                          </FieldDescription>
                        </FieldContent>

                        <RadioGroupItem
                          id={fastingPlan.id}
                          value={fastingPlan.id}
                        />
                      </Field>
                    </FieldLabel>
                  </div>
                ))}
              </RadioGroup>

              <Button onClick={handleSave} disabled={planId === draftPlanId}>
                Save
              </Button>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className='space-y-2'>
          <p className='bg-primary text-primary-foreground w-fit rounded-full px-4 py-1 text-xl font-medium'>
            {selectedPlan.title}
          </p>

          <p className='text-muted-foreground text-sm'>
            {pluralize(selectedPlan.fastingHours, 'hour')} fasting with{' '}
            {pluralize(selectedPlan.eatingHours, 'hour')} eating window.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
