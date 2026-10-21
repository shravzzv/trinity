'use client'

import { Button } from './ui/button'
import { Flame, PartyPopper, Sparkles } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { motion, type MotionNodeAnimationOptions } from 'motion/react'

const partyIconAnimations: MotionNodeAnimationOptions = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
}

const titleAnimations: MotionNodeAnimationOptions = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
}

const descAnimations: MotionNodeAnimationOptions = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
}

const fastingDurationAnimations: MotionNodeAnimationOptions = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
}

const cardAnimations: MotionNodeAnimationOptions = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
}

const MotionDialogTitle = motion.create(DialogTitle)
const MotionDialogDescription = motion.create(DialogDescription)
const MotionCard = motion.create(Card)

export default function SuccessfulFastDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Show Dialog</Button>
      </DialogTrigger>

      <DialogContent>
        <motion.div
          className='bg-primary/10 dark:bg-primary/40 mx-auto flex size-20 items-center justify-center rounded-full'
          {...partyIconAnimations}
        >
          <PartyPopper className='mx-auto size-10' />
        </motion.div>

        <DialogHeader className='items-center text-center'>
          <MotionDialogTitle
            className='w-full text-center text-2xl'
            {...titleAnimations}
          >
            Fast completed!
          </MotionDialogTitle>
          <MotionDialogDescription
            className='w-full text-center'
            {...descAnimations}
          >
            You followed through on your plan. Take a moment to appreciate that.
          </MotionDialogDescription>
        </DialogHeader>

        <motion.div
          className='flex flex-col items-center justify-center'
          {...fastingDurationAnimations}
        >
          <p>Fasting duration</p>
          <p className='text-2xl font-semibold'>23h 30m</p>
        </motion.div>

        <div className='grid grid-cols-2 gap-6'>
          <MotionCard {...cardAnimations}>
            <CardContent className='space-y-2'>
              <div className='flex items-center justify-center gap-2'>
                <Sparkles className='size-6' />
                <p className='text-2xl font-bold'>10</p>
              </div>

              <p className='text-muted-foreground text-center text-sm'>
                XP earned
              </p>
            </CardContent>
          </MotionCard>

          <MotionCard {...cardAnimations}>
            <CardContent className='space-y-2'>
              <div className='flex items-center justify-center gap-2'>
                <Flame className='size-6' />
                <p className='text-2xl font-bold'>8</p>
              </div>

              <p className='text-muted-foreground text-center text-sm'>
                Streak
              </p>
            </CardContent>
          </MotionCard>
        </div>
      </DialogContent>
    </Dialog>
  )
}
