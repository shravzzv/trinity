import { Anchor, Flame, Trophy } from 'lucide-react'
import { Card, CardContent } from './ui/card'

export default function ProgressCard() {
  return (
    <Card>
      <CardContent className='grid grid-cols-3 gap-2'>
        <div className='bg-muted/40 flex flex-col items-center gap-1 rounded-lg border p-4'>
          <div className='flex items-center gap-2'>
            <Flame className='size-5' />
            <p className='text-xl font-bold'>18</p>
          </div>
          <p className='text-muted-foreground text-xs'>Streak</p>
        </div>

        <div className='bg-muted/40 flex flex-col items-center gap-1 rounded-lg border p-4'>
          <div className='flex items-center gap-2'>
            <Anchor className='size-5' />
            <p className='text-xl font-bold'>2</p>
          </div>
          <p className='text-muted-foreground text-xs'>Anchors</p>
        </div>

        <div className='bg-muted/40 flex flex-col items-center gap-1 rounded-lg border p-4'>
          <div className='flex items-center gap-2'>
            <Trophy className='size-5' />
            <p className='text-xl font-bold'>0</p>
          </div>
          <p className='text-muted-foreground text-xs'>Level</p>
        </div>
      </CardContent>
    </Card>
  )
}
