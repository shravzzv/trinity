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
import NumberFlow, { NumberFlowGroup } from '@number-flow/react'

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
  const [xp, setxp] = useState(0)
  const [streak, setStreak] = useState(7)
  const [fastHours, setFastHours] = useState(0)
  const [fastMinutes, setFastMinutes] = useState(0)

  const incrementxp = () => {
    const intervalId = setInterval(() => {
      setxp((prev) => {
        if (prev >= 10) {
          clearInterval(intervalId)
          incrementStreak()
          return prev
        }

        return prev + 1
      })
    }, 150)
  }

  const incrementStreak = () => {
    setStreak((prev) => prev + 1)
  }

  const incrementFastHours = () => {
    const intervalId = setInterval(() => {
      setFastHours((prev) => {
        if (prev >= 23) {
          clearInterval(intervalId)
          return prev
        }

        return prev + 1
      })
    }, 30)
  }

  const incrementFastMinutes = () => {
    const intervalId = setInterval(() => {
      setFastMinutes((prev) => {
        if (prev >= 30) {
          clearInterval(intervalId)
          incrementxp()
          return prev
        }

        return prev + 1
      })
    }, 30)
  }

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
