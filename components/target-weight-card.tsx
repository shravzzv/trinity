'use client'

import { Pen, Target } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card'

export default function TargetWeightCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight target</CardTitle>

        <CardAction>
          <Button variant='outline'>
            <Pen />
            Edit
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className='flex items-center gap-2'>
          <Target className='text-muted-foreground size-5 shrink-0' />
          <p className='text-2xl font-semibold'>58.0 kg</p>
        </div>
      </CardContent>
    </Card>
  )
}
