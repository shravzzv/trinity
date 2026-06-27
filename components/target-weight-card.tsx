'use client'

import { Pen, Play, Target } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card'

interface TargetWeightCardProps {
  targetWeight: number | null
  update: (newTarget: number) => void
}

export default function TargetWeightCard({
  targetWeight,
  update,
}: TargetWeightCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight target</CardTitle>

        <CardAction>
          <Button variant='outline'>
            {targetWeight ? (
              <>
                <Pen />
                Edit
              </>
            ) : (
              <>
                <Play />
                Set
              </>
            )}
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {targetWeight ? (
          <div className='flex items-center gap-2'>
            <Target className='text-muted-foreground size-5 shrink-0' />
            <p className='text-2xl font-semibold'>58.0 kg</p>
          </div>
        ) : (
          <p className='text-muted-foreground text-sm'>
            You haven&apos;t set a target weight yet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
