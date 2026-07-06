'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { Flame } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from './ui/card'
import { Separator } from './ui/separator'

export default function StreakDialog() {
  const completedDays = [
    new Date(2026, 6, 1),
    new Date(2026, 6, 3),
    new Date(2026, 6, 5),
  ]
  const missedDays = [new Date(2026, 6, 2)]
  const anchoredDays = [new Date(2026, 6, 4)]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-auto flex-col items-center justify-center gap-1 py-2'
        >
          <div className='flex items-center gap-2'>
            <Flame className='size-5' />
            <p className='text-xl font-bold'>18</p>
          </div>

          <p className='text-muted-foreground text-xs'>Streak</p>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Streak</DialogTitle>
          <DialogDescription>
            Your streak grows each day you complete your fasting goal. Anchors
            preserve your streak on planned flex days.
          </DialogDescription>
        </DialogHeader>

        <Card className='mx-auto w-fit p-0'>
          <CardContent className='p-0'>
            <Calendar
              mode='single'
              showWeekNumber
              selected={undefined}
              onSelect={() => {}}
              showOutsideDays={false}
              modifiers={{
                missed: missedDays,
                anchored: anchoredDays,
                completed: completedDays,
              }}
              classNames={{
                today:
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground border-2 border-primary',
                day_button:
                  'hover:bg-transparent hover:text-foreground cursor-default',
              }}
              modifiersClassNames={{
                missed: 'border-2 border-destructive bg-destructive/10',
                anchored: 'border-2 border-sky-500 bg-sky-500/10 border-dotted',
                completed:
                  'border-2 border-green-600 bg-green-600/10 font-medium',
              }}
              footer={<StreakCalendarLegend />}
            />
          </CardContent>
        </Card>

        <Card className='flex flex-row gap-0'>
          <CardContent className='flex flex-1 flex-col items-center justify-center'>
            <p className='text-2xl font-bold'>18</p>
            <span className='text-muted-foreground text-center text-xs'>
              Current streak
            </span>
          </CardContent>

          <Separator orientation='vertical' />

          <CardContent className='flex flex-1 flex-col items-center justify-center'>
            <p className='text-muted-foreground text-2xl font-bold'>24</p>
            <span className='text-muted-foreground text-center text-xs'>
              Longest streak
            </span>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

const StreakCalendarLegend = () => {
  return (
    <footer className='flex items-center justify-center gap-4 py-2 text-xs'>
      <div className='flex items-center gap-1'>
        <div className='size-3 rounded-full border-2 border-green-600 bg-green-600/10' />
        <span>Completed</span>
      </div>
      <div className='flex items-center gap-1'>
        <div className='border-destructive bg-destructive/10 size-3 rounded-full border-2' />
        Missed
      </div>
      <div className='flex items-center gap-1'>
        <div className='size-3 rounded-full border-2 border-dotted border-sky-500 bg-sky-500/10' />
        Anchor
      </div>
    </footer>
  )
}
