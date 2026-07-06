import { Card, CardContent } from './ui/card'
import StreakDialog from './streak-dialog'
import AnchorsDialog from './anchors-dialog'
import LevelsDialog from './levels-dialog'

export default function ProgressCard() {
  return (
    <Card className='py-2'>
      <CardContent className='grid grid-cols-3 gap-2 px-2'>
        <StreakDialog />
        <AnchorsDialog />
        <LevelsDialog />
      </CardContent>
    </Card>
  )
}
