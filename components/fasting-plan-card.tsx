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
import { Badge } from '@/components/ui/badge'
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
import { useEffect, useRef, useState } from 'react'
import { Skeleton } from './ui/skeleton'

const fastingPlans = [
  {
    id: '16:8',
    title: '16:8',
    fastingHours: 16,
    eatingHours: 8,
  },
  {
    id: '18:6',
    title: '18:6',
    fastingHours: 18,
    eatingHours: 6,
  },
  {
    id: '20:4',
    title: '20:4',
    fastingHours: 20,
    eatingHours: 4,
  },
  {
    id: '23:1',
    title: '23:1',
    fastingHours: 23,
    eatingHours: 1,
  },
]

const formatHours = (hours: number) => {
  return `${hours} hour${hours === 1 ? '' : 's'}`
}

const LOCAL_STORAGE_TITLE = 'fastingPlan'

export default function FastingPlanCard() {
  const [plan, setPlan] = useState('16:8')
  const [draftPlan, setDraftPlan] = useState(plan)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const hasHydrated = useRef(false)

  const selectedPlan =
    fastingPlans.find((p) => p.id === plan) ?? fastingPlans[0]

  const handleSave = () => {
    setPlan(draftPlan)
    setIsDialogOpen(false)
  }

  /**
   * Hydrate plan from local storage if present.
   */
  useEffect(() => {
    const hydrate = () => {
      const existingPlan = localStorage.getItem(LOCAL_STORAGE_TITLE)
      if (!existingPlan) {
        hasHydrated.current = true
        setIsLoading(false)
        return
      }

      setPlan(existingPlan)
      setIsLoading(false)
      hasHydrated.current = true
    }

    hydrate()
  }, [])

  /**
   * Sync selected plan with local storage on change.
   */
  useEffect(() => {
    if (!hasHydrated.current) return
    localStorage.setItem(LOCAL_STORAGE_TITLE, plan)
  }, [plan])

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

            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
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
            <Skeleton className='h-8 w-32 rounded-2xl' />
            <Skeleton className='h-4 w-full rounded-2xl' />
          </div>
        ) : (
          <div className='space-y-2'>
            <Badge className='bg-sky-50 px-4 py-4 text-xl text-sky-700 dark:bg-sky-950 dark:text-sky-300'>
              {selectedPlan.title}
            </Badge>

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
