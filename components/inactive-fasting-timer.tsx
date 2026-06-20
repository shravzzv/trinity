'use client'

import { Button } from './ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

interface InactiveFastingTimerProps {
  startFasting: () => void
}

export default function InactiveFastingTimer({
  startFasting,
}: InactiveFastingTimerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting timer</CardTitle>
        <CardDescription>No active fasting session.</CardDescription>

        <CardAction>
          <Button onClick={startFasting}>Start fasting</Button>
        </CardAction>
      </CardHeader>
    </Card>
  )
}
