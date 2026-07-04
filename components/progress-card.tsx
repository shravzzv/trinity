import { Anchor, Flame, Trophy } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'

export default function ProgressCard() {
  return (
    <Card>
      <CardContent className='grid grid-cols-3 gap-2 py-0'>
        <Button variant='ghost' className='flex h-auto flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <Flame className='size-5' />
            <p className='text-xl font-bold'>18</p>
          </div>

          <p className='text-muted-foreground text-xs'>Streak</p>
        </Button>

        <Button variant='ghost' className='flex h-auto flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <Anchor className='size-5' />
            <p className='text-xl font-bold'>12</p>
          </div>

          <p className='text-muted-foreground text-xs'>Anchors</p>
        </Button>

        <Button variant='ghost' className='flex h-auto flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <Trophy className='size-5' />
            <p className='text-xl font-bold'>0</p>
          </div>

          <p className='text-muted-foreground text-xs'>Level</p>
        </Button>
      </CardContent>
    </Card>
  )
}
