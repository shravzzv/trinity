import { Card, CardContent } from './ui/card'
import StreakDialog from './streak-dialog'
import AnchorsDialog from './anchors-dialog'
import LevelsDialog from './levels-dialog'
import type { Fast } from '@/types/fasting'
import ProgressCardSkeleton from './progress-card-skeleton'

interface ProgressCardProps {
  xp: number
  fasts: Fast[]
  level: number
  streak: number
  anchors: number
  isLoading: boolean
}

export default function ProgressCard({
  xp,
  fasts,
  level,
  streak,
  anchors,
  isLoading,
}: ProgressCardProps) {
  if (isLoading) return <ProgressCardSkeleton />

  return (
    <Card className='py-2'>
      <CardContent className='grid grid-cols-3 gap-2 px-2'>
        <StreakDialog fasts={fasts} streak={streak} />
        <AnchorsDialog anchors={anchors} />
        <LevelsDialog xp={xp} level={level} />
      </CardContent>
    </Card>
  )
}
