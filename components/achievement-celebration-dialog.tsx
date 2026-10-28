'use client'

import { Achievement, AchievementType } from '@/types/gamification'
import { Anchor, Flame, LucideIcon, PartyPopper, Trophy, X } from 'lucide-react'
import { Button } from './ui/button'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'

interface AchievementCelebrationDialogProps {
  open: boolean
  achievement: Achievement | null
  close: () => void
  onOpenChange: (open: boolean) => void
}

const achievementIcons = {
  level: Trophy,
  streak: Flame,
  anchor: Anchor,
} satisfies Record<AchievementType, LucideIcon>

export default function AchievementCelebrationDialog({
  open,
  close,
  achievement,
  onOpenChange,
}: AchievementCelebrationDialogProps) {
  const blastConfetti = () => {
    confetti({ particleCount: 150, origin: { y: 0.7 } })
  }

  useEffect(() => {
    if (!open || !achievement) return

    const timeoutId = window.setTimeout(() => {
      blastConfetti()
    }, 150)

    return () => window.clearTimeout(timeoutId)
  }, [achievement, open])

  if (!achievement) return null
  const Icon = achievementIcons[achievement.type]

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <div
          aria-label={`${achievement.type} achievement`}
          className='bg-primary/10 dark:bg-primary/40 mx-auto flex size-20 items-center justify-center rounded-full'
        >
          <Icon className='mx-auto size-10' />
        </div>

        <AlertDialogHeader className='items-center text-center'>
          <AlertDialogTitle className='w-full text-center text-2xl'>
            {achievement.title}
          </AlertDialogTitle>
          <AlertDialogDescription className='w-full text-center'>
            {achievement.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='flex items-center justify-center gap-2'>
          <Button variant='outline' onClick={close}>
            <X />
            Close
          </Button>

          <Button variant='secondary' size='icon' onClick={blastConfetti}>
            <PartyPopper />
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
