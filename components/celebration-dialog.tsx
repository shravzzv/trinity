'use client'

import { Achievement, AchievementType } from '@/types/gamification'
import { Anchor, Flame, LucideIcon, PartyPopper, Trophy, X } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'

interface CelebrationDialogProps {
  achievement: Achievement | null
  onDismiss: () => void
}

const achievementIcons = {
  level: Trophy,
  streak: Flame,
  anchor: Anchor,
} satisfies Record<AchievementType, LucideIcon>

export default function CelebrationDialog({
  onDismiss,
  achievement,
}: CelebrationDialogProps) {
  const blastConfetti = () => {
    confetti({ particleCount: 150, origin: { y: 0.7 } })
  }

  useEffect(() => {
    if (!achievement) return

    const timeoutId = window.setTimeout(() => {
      blastConfetti()
    }, 150)

    return () => window.clearTimeout(timeoutId)
  }, [achievement])

  if (!achievement) return null

  const Icon = achievementIcons[achievement.type]

  return (
    <AlertDialog
      open
      onOpenChange={(open) => {
        if (!open) onDismiss()
      }}
    >
      <AlertDialogContent>
        <Card>
          <div
            aria-label={`${achievement.type} achievement`}
            className='bg-primary/10 mx-auto flex size-20 items-center justify-center rounded-full'
          >
            <Icon className='mx-auto size-10' />
          </div>
        </Card>

        <AlertDialogHeader className='items-center text-center'>
          <AlertDialogTitle className='w-full text-center text-2xl'>
            {achievement.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {achievement.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='flex items-center justify-center gap-2'>
          <Button variant='outline' onClick={onDismiss}>
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
