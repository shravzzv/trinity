'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Achievement, AchievementType } from '@/types/gamification'
import { Anchor, Flame, LucideIcon, PartyPopper, Trophy, X } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'

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
  if (!achievement) return null

  const Icon = achievementIcons[achievement.type]

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onDismiss()
      }}
    >
      <DialogContent showCloseButton={false}>
        <Card>
          <div
            aria-label={`${achievement.type} achievement`}
            className='bg-primary/10 mx-auto flex size-20 items-center justify-center rounded-full'
          >
            <Icon className='mx-auto size-10' />
          </div>
        </Card>

        <DialogHeader className='items-center text-center'>
          <DialogTitle className='text-2xl'>{achievement.title}</DialogTitle>
          <DialogDescription>{achievement.description}</DialogDescription>
        </DialogHeader>

        <div className='flex items-center justify-center gap-2'>
          <Button>
            <X />
            Close
          </Button>

          {/* <Button variant='outline' size='icon'>
            <PartyPopper />
          </Button> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
