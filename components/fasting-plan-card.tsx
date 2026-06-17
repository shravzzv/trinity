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
import { Skeleton } from './ui/skeleton'
import { formatHours } from '@/lib/time'
import { fastingPlans } from '@/constants/fasting-plans'

interface FastingPlanCardProps {
  plan: string
  isLoading: boolean
  setPlan: (plan: string) => void
}

export default function FastingPlanCard({
  plan,
  setPlan,
  isLoading,
}: FastingPlanCardProps) {
  const [draftPlan, setDraftPlan] = useState(plan)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const selectedPlan =
    fastingPlans.find((p) => p.id === plan) ?? fastingPlans[0]

  const handleSave = () => {
    setPlan(draftPlan)
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
              if (open) setDraftPlan(plan)
              setIsDialogOpen(open)
            }}
          >
            <DialogTrigger asChild>
              <Button variant='outline' size='sm'>
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
                value={draftPlan}
                onValueChange={setDraftPlan}
                className='max-h-[50vh] max-w-sm overflow-y-auto'
              >
                {fastingPlans.map((fastingPlan) => (
                  <div key={fastingPlan.id}>
                    <FieldLabel htmlFor={fastingPlan.id}>
                      <Field orientation='horizontal'>
                        <FieldContent>
                          <FieldTitle>{fastingPlan.title}</FieldTitle>

                          <FieldDescription>
                            {formatHours(fastingPlan.fastingHours)} fasting with{' '}
                            {formatHours(fastingPlan.eatingHours)} eating window
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

              <Button onClick={handleSave} disabled={plan === draftPlan}>
                Save
              </Button>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className='space-y-2'>
            <Skeleton className='h-10 w-28 rounded-2xl' />
            <Skeleton className='h-4 w-full rounded-2xl' />
          </div>
        ) : (
          <div className='space-y-2'>
            <p className='bg-primary text-primary-foreground w-fit rounded-full px-4 py-1 text-xl font-medium'>
              {selectedPlan.title}
            </p>

            <p className='text-muted-foreground text-sm'>
              {formatHours(selectedPlan.fastingHours)} fasting with{' '}
              {formatHours(selectedPlan.eatingHours)} eating window
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
