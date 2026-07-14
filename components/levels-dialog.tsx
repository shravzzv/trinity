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
import { Sparkles, Trophy } from 'lucide-react'
import { Progress } from './ui/progress'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion'
import { levels, levelsAccordionInfo } from '@/constants/gamification'
import { Card, CardContent } from './ui/card'
import { Separator } from './ui/separator'

interface LevelsDialogProps {
  xp: number
  level: number
}

export default function LevelsDialog({ xp, level }: LevelsDialogProps) {
  const xpEarned = xp
  const xpRequired = 100
  const currentLevel = level
  const maxLevel = levels[levels.length - 1].level
  const nextLevel = Math.max(currentLevel + 1, maxLevel)
  const progress = (xpEarned / xpRequired) * 100

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-auto flex-col items-center justify-center gap-1 py-2'
        >
          <div className='flex items-center gap-2'>
            <Trophy className='size-5' />
            <p className='text-xl font-bold'>{currentLevel}</p>
          </div>

          <p className='text-muted-foreground text-xs capitalize'>Level</p>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Levels</DialogTitle>
          <DialogDescription>
            Celebrate your long-term progress by earning XP and reaching new
            levels.
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className='flex gap-0 p-0'>
            <div className='flex flex-1 flex-col items-center justify-center gap-1'>
              <div className='flex items-center justify-center gap-2'>
                <Trophy className='size-6' />
                <p className='text-2xl font-bold'>{currentLevel}</p>
              </div>

              <span className='text-muted-foreground text-center text-xs capitalize'>
                Level
              </span>
            </div>

            <Separator orientation='vertical' />

            <div className='flex flex-1 flex-col items-center justify-center gap-1'>
              <div className='flex items-center justify-center gap-2'>
                <Sparkles className='size-6' />
                <p className='text-2xl font-bold'>{xpEarned}</p>
              </div>

              <span className='text-muted-foreground text-center text-xs'>
                XP Earned
              </span>
            </div>
          </CardContent>
        </Card>

        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-sm font-medium'>
              {currentLevel}
            </span>
            <Progress value={progress} className='flex-1' />
            <span className='text-muted-foreground text-sm font-medium'>
              {nextLevel}
            </span>
          </div>

          <p className='text-muted-foreground text-center text-sm'>
            Next level in {xpRequired - xpEarned} XP.
          </p>
        </div>

        <Accordion type='single' collapsible>
          {levelsAccordionInfo.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.trigger}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  )
}
