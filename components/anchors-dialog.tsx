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
import { Anchor } from 'lucide-react'
import { Progress } from './ui/progress'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  ANCHOR_STREAK_REQUIREMENT,
  anchorsAccordionInfo,
} from '@/constants/gamification'
import { Card, CardContent } from './ui/card'

interface AnchorsDialogProps {
  streak: number
  anchors: number
}

export default function AnchorsDialog({ anchors, streak }: AnchorsDialogProps) {
  const anchorsAvailable = anchors
  const fastsCompletedTowardsNextAnchor = streak % ANCHOR_STREAK_REQUIREMENT
  const progress =
    (fastsCompletedTowardsNextAnchor / ANCHOR_STREAK_REQUIREMENT) * 100

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-auto flex-col items-center justify-center gap-1 py-2'
        >
          <div className='flex items-center gap-2'>
            <Anchor className='size-5' />
            <p className='text-xl font-bold'>{anchorsAvailable}</p>
          </div>

          <p className='text-muted-foreground text-xs'>Anchors</p>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anchors</DialogTitle>
          <DialogDescription>
            Preserve your streak when life gets in the way of your fasting
            routine.
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className='flex flex-col items-center justify-center gap-2 p-0'>
            <div className='flex items-center justify-center gap-2'>
              <Anchor className='size-6' />
              <p className='text-2xl font-bold'>{anchorsAvailable}</p>
            </div>
            <p className='text-muted-foreground text-xs'>Available</p>
          </CardContent>
        </Card>

        <p className='text-center'>
          Next Anchor in{' '}
          {ANCHOR_STREAK_REQUIREMENT - fastsCompletedTowardsNextAnchor}{' '}
          completed fasts.
        </p>

        <div className='flex items-center gap-2'>
          <Progress value={progress} className='flex-3 lg:flex-4' />
          <p className='flex-1 text-center'>
            {fastsCompletedTowardsNextAnchor}/{ANCHOR_STREAK_REQUIREMENT} fasts
          </p>
        </div>

        <Accordion type='single' collapsible>
          {anchorsAccordionInfo.map((item) => (
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
