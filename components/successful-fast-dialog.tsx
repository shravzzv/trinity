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

export default function SuccessfulFastDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Show Dialog</Button>
      </DialogTrigger>

      <DialogContent>
        <div className='bg-primary/10 mx-auto flex size-20 items-center justify-center rounded-full'>
          <PartyPopper className='mx-auto size-10' />
        </div>

        <DialogHeader className='items-center text-center'>
          <DialogTitle className='w-full text-center text-2xl'>
            Fast completed!
          </DialogTitle>
          <DialogDescription className='w-full text-center'>
            You followed through on your plan. Take a moment to appreciate that.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-center justify-center'>
          <p>Fasting duration</p>
          <p className='text-2xl font-semibold'>23h 30m</p>
        </div>

        <div className='grid grid-cols-2 gap-6'>
          <Card>
            <CardContent className='space-y-2'>
              <div className='flex items-center justify-center gap-2'>
                <Sparkles className='size-6' />
                <p className='text-2xl font-bold'>10</p>
              </div>

              <p className='text-muted-foreground text-center text-sm'>
                XP earned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='space-y-2'>
              <div className='flex items-center justify-center gap-2'>
                <Flame className='size-6' />
                <p className='text-2xl font-bold'>8</p>
              </div>

              <p className='text-muted-foreground text-center text-sm'>
                Streak
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
