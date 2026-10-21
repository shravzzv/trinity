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
import { motion, type Variants } from 'motion/react'

const MotionCard = motion.create(Card)
const MotionDialogTitle = motion.create(DialogTitle)
const MotionDialogDescription = motion.create(DialogDescription)

const dialogContentVariants: Variants = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1, transition: { staggerChildren: 0.15 } },
}

const dialogContentChildVariants: Variants = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
}

const titleVariants: Variants = {
  initial: { opacity: 0, scale: 0, y: 4 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
}

export default function SuccessfulFastDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Show Dialog</Button>
      </DialogTrigger>

      <DialogContent>
        <motion.div
          variants={dialogContentVariants}
          initial='initial'
          animate='animate'
          className='flex flex-col gap-6'
        >
          <motion.div
            className='bg-primary/10 dark:bg-primary/40 mx-auto flex size-20 items-center justify-center rounded-full'
            variants={dialogContentChildVariants}
          >
            <PartyPopper className='mx-auto size-10' />
          </motion.div>

          <DialogHeader className='items-center text-center'>
            <MotionDialogTitle
              className='w-full text-center text-2xl'
              variants={titleVariants}
            >
              Fast completed!
            </MotionDialogTitle>

            <MotionDialogDescription
              className='w-full text-center'
              variants={dialogContentChildVariants}
            >
              You followed through on your plan. Take a moment to appreciate
              that.
            </MotionDialogDescription>
          </DialogHeader>

          <motion.div
            className='flex flex-col items-center justify-center'
            variants={dialogContentChildVariants}
          >
            <p>Fasting duration</p>
            <p className='text-2xl font-semibold'>23h 30m</p>
          </motion.div>

          <div className='grid grid-cols-2 gap-6'>
            <MotionCard variants={dialogContentChildVariants}>
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

            <MotionCard variants={dialogContentChildVariants}>
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
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
