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
import { Flame, Trophy } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from './ui/card'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import type { StreakStatus } from '@/types/gamification'
import { cn } from '@/lib/utils'
import type { Fast } from '@/types/fasting'
import { getLongestStreak, getStreakCalendarDays } from '@/lib/gamification'

const streakCalendarStyles = {
  completed:
    'bg-primary/20 text-primary dark:bg-primary/40 dark:text-primary-foreground',

  missed:
    'bg-destructive/20 text-destructive dark:bg-destructive/25 dark:text-destructive-foreground',

  anchored:
    'bg-anchor/40 text-anchor-950 dark:bg-anchor/40 dark:text-anchor-950',
} satisfies Record<StreakStatus, string>

const streakLegend = [
  { status: 'completed', label: 'Completed' },
  { status: 'missed', label: 'Missed' },
  { status: 'anchored', label: 'Anchored' },
] satisfies {
  status: StreakStatus
  label: string
}[]

interface StreakDialogProps {
  fasts: Fast[]
  streak: number
}

export default function StreakDialog({ fasts, streak }: StreakDialogProps) {
  const { completed, missed, anchored } = getStreakCalendarDays(fasts)

  const currentStreak = streak
  const longestStreak = getLongestStreak(fasts)
  const isCurrentStreakPersonalBest =
    currentStreak > 0 && currentStreak === longestStreak

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-auto flex-col items-center justify-center gap-1 py-2'
        >
          <div className='flex items-center gap-2'>
            <Flame className='size-5' />
            <p className='text-xl font-bold'>{currentStreak}</p>
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
              modifiers={{ missed, anchored, completed }}
              classNames={{
                today: 'ring-2 ring-primary border-transparent',
                day_button:
                  'h-8 w-8 rounded-lg font-medium transition-colors rounded-full hover:bg-transparent',
              }}
              modifiersClassNames={streakCalendarStyles}
              footer={<StreakCalendarLegend />}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className='flex gap-0 p-0'>
            <div className='flex flex-1 flex-col items-center justify-center gap-1'>
              <p className='text-2xl font-bold'>{currentStreak}</p>

              <span className='text-muted-foreground text-center text-xs'>
                Current streak
              </span>

              {isCurrentStreakPersonalBest && (
                <Badge>
                  <Trophy />
                  Personal best
                </Badge>
              )}
            </div>

            <Separator orientation='vertical' />

            <div className='flex flex-1 flex-col items-center justify-center gap-1'>
              <p className='text-muted-foreground text-2xl font-bold'>
                {longestStreak}
              </p>

              <span className='text-muted-foreground text-center text-xs'>
                Longest streak
              </span>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

const StreakCalendarLegend = () => {
  return (
    <footer className='flex items-center justify-center gap-3 py-2 text-xs'>
      {streakLegend.map(({ status, label }) => (
        <div key={status} className='flex items-center gap-2'>
          <div
            className={cn('size-3 rounded-full', streakCalendarStyles[status])}
          />
          <span>{label}</span>
        </div>
      ))}
    </footer>
  )
}
