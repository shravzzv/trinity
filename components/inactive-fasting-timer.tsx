'use client'

import { Goal } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card'
import FastingPlanDialog from './fasting-plan-dialog'
import { toast } from 'sonner'
import { type UseFastingResult } from '@/hooks/use-fasting'

interface InactiveFastingTimerProps {
  hasPlan: boolean
  updatePlanId: UseFastingResult['updatePlanId']
  startFasting: (startedAt?: Date) => Promise<void>
}

export default function InactiveFastingTimer({
  hasPlan,
  startFasting,
  updatePlanId,
}: InactiveFastingTimerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting timer</CardTitle>

        <CardAction>
          {hasPlan ? (
            <Button onClick={() => startFasting()}>Start fasting</Button>
          ) : (
            <FastingPlanDialog
              dialogTitle='Select your fasting plan'
              dialogDescription='Choose the fasting schedule that best matches your routine. You can change it later at any time.'
              selectedPlanId={null}
              onSubmit={(selectedPlanId) => {
                updatePlanId(selectedPlanId)
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
