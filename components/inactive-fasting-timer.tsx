'use client'

import { Goal } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card'
import FastingPlanDialog from './fasting-plan-dialog'
import { toast } from 'sonner'
import { type UseFastingResult } from '@/hooks/use-fasting'
import type { FastingPlanId, PreferredFastStartTime } from '@/types/fasting'
import { getInitialSessionStartedAt } from '@/lib/fasting'
import { xpRewards } from '@/constants/gamification'

interface InactiveFastingTimerProps {
  planId: FastingPlanId | null
  awardXp: (amount: number) => void
  updatePlanId: UseFastingResult['updatePlanId']
  startFasting: (startedAt?: Date) => Promise<void>
  preferredFastStartTime: PreferredFastStartTime | null
}

export default function InactiveFastingTimer({
  planId,
  awardXp,
  startFasting,
  updatePlanId,
  preferredFastStartTime,
}: InactiveFastingTimerProps) {
  const hasPlan = planId !== null
  const fastStartsAt = getInitialSessionStartedAt(preferredFastStartTime)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting timer</CardTitle>

        <CardAction>
          {hasPlan ? (
            <Button onClick={() => startFasting(fastStartsAt ?? undefined)}>
              Start fasting
            </Button>
          ) : (
            <FastingPlanDialog
              dialogTitle='Select your fasting plan'
              dialogDescription='Choose the fasting schedule that best matches your routine. You can change it later at any time.'
              selectedPlanId={null}
              onSubmit={(selectedPlanId) => {
                updatePlanId(selectedPlanId)
                awardXp(xpRewards.selectedFastingPlan)
                toast.success('Fasting plan selected')
              }}
            >
              <Button>
                <Goal />
                Select plan
              </Button>
            </FastingPlanDialog>
          )}
        </CardAction>
      </CardHeader>

      <CardContent>
        <p className='text-muted-foreground'>
          {hasPlan
            ? 'No active fasting session.'
            : 'You need to select a fasting plan in order to get started.'}
        </p>
      </CardContent>
    </Card>
  )
}
