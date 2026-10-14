'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from './ui/button'
import { Flame, PartyPopper, Sparkles, X } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { useState } from 'react'

export default function SuccessfulFastDialog() {
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <AlertDialogTrigger asChild>
        <Button variant='outline' onClick={() => setOpen(true)}>
          Show Dialog
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <div className='bg-primary/10 mx-auto flex size-20 items-center justify-center rounded-full'>
          <PartyPopper className='mx-auto size-10' />
        </div>

        <AlertDialogHeader className='items-center text-center'>
          <AlertDialogTitle className='w-full text-center text-2xl'>
            Fast completed!
          </AlertDialogTitle>
          <AlertDialogDescription className='w-full text-center'>
            You followed through on your plan. Take a moment to appreciate that.
          </AlertDialogDescription>
        </AlertDialogHeader>

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
                Current streak
              </p>
            </CardContent>
          </Card>
        </div>

        <div className='flex flex-row justify-center'>
          <Button onClick={() => setOpen(false)}>
            <X />
            Close
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
