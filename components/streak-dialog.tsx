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
import { Flame } from 'lucide-react'

export default function StreakDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-auto flex-col items-center justify-center gap-1 py-2'
        >
          <div className='flex items-center gap-2'>
            <Flame className='size-5' />
            <p className='text-xl font-bold'>18</p>
          </div>

          <p className='text-muted-foreground text-xs'>Streak</p>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Streaks</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
