import { Card, CardContent } from './ui/card'
import StreakDialog from './streak-dialog'
import AnchorsDialog from './anchors-dialog'
import LevelsDialog from './levels-dialog'
import type { Fast } from '@/types/fasting'

interface ProgressCardProps {
  fasts: Fast[]
}

export default function ProgressCard({ fasts }: ProgressCardProps) {
  return (
    <Card className='py-2'>
      <CardContent className='grid grid-cols-3 gap-2 px-2'>
        <StreakDialog fasts={fasts} />
        <AnchorsDialog />
        <LevelsDialog />
      </CardContent>
    </Card>
  )
}
