'use client'

import { Flame, PartyPopper, Sparkles } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { motion, type Variants } from 'motion/react'
import { useEffect, useState } from 'react'
import { useGamificationContext } from '@/providers/gamification-provider'
import { useFastingContext } from '@/providers/fasting-provider'
import { xpRewards } from '@/constants/gamification'
import NumberFlow, { NumberFlowGroup } from '@number-flow/react'
import { SUCCESSFUL_FAST_STARTED_AT } from '@/constants/storage-keys'

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

const XP_REWARD = xpRewards.completedFast

interface SuccessfulFastDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SuccessfulFastDialog({
  open,
  onOpenChange,
}: SuccessfulFastDialogProps) {
  const { streak } = useGamificationContext()
  const { session } = useFastingContext()

  const [xpLocal, setxpLocal] = useState(0)
  const [fastHours, setFastHours] = useState(0)
  const [fastMinutes, setFastMinutes] = useState(0)
  const [streakLocal, setStreakLocal] = useState(0)

  useEffect(() => {
    const syncStreak = () => setStreakLocal(Math.max(0, streak - 1))
    syncStreak()
  }, [streak])

  const getSessionTime = () => {
    if (!session) throw Error

    const LS_value = localStorage.getItem(SUCCESSFUL_FAST_STARTED_AT)
    if (!LS_value) throw Error

    const fastStartedAt = new Date(LS_value).getTime()
    const fastEndedAt = new Date(session.startedAt).getTime()

    const ms = fastEndedAt - fastStartedAt
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)

    return { hours, minutes }
  }

  const incrementxp = () => {
    const intervalId = setInterval(() => {
      setxpLocal((prev) => {
        if (prev === XP_REWARD) {
          clearInterval(intervalId)
          incrementStreak()
          return prev
        }

        return prev + 1
      })
    }, 150)
  }

  const incrementStreak = () => setStreakLocal(streak)

  const incrementFastHours = () => {
    const targetHours = getSessionTime().hours

    const intervalId = setInterval(() => {
      setFastHours((prev) => {
        if (prev === targetHours) {
          clearInterval(intervalId)
          return prev
        }

        return prev + 1
      })
    }, 30)
  }

  const incrementFastMinutes = () => {
    const targetMinutes = getSessionTime().minutes

    const intervalId = setInterval(() => {
      setFastMinutes((prev) => {
        if (prev === targetMinutes) {
          clearInterval(intervalId)
          incrementxp()
          return prev
        }

        return prev + 1
      })
    }, 30)
  }

  const resetState = () => {
    setFastHours(0)
    setFastMinutes(0)
    setxpLocal(0)
    setStreakLocal(Math.max(0, streak - 1))

    localStorage.removeItem(SUCCESSFUL_FAST_STARTED_AT)
  }

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
    if (!open) resetState()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            onAnimationComplete={() => {
              incrementFastHours()
              incrementFastMinutes()
            }}
          >
            <p>Fasting duration</p>
            <NumberFlowGroup>
              <div className='text-2xl font-semibold'>
                <NumberFlow value={fastHours} suffix='h' />{' '}
                <NumberFlow value={fastMinutes} suffix='m' />
              </div>
            </NumberFlowGroup>
          </motion.div>

          <div className='grid grid-cols-2 gap-6'>
            <MotionCard variants={dialogContentChildVariants}>
              <CardContent className='space-y-2'>
                <div className='flex items-center justify-center gap-2'>
                  <Sparkles className='size-6' />
                  <motion.p className='text-2xl font-bold'>
                    <NumberFlow value={xpLocal} />
                  </motion.p>
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
                  <p className='text-2xl font-bold'>
                    <NumberFlow value={streakLocal} />
                  </p>
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
