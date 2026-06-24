'use client'

import type { Fast } from '@/types/fasting'
import { Button } from './ui/button'
import { Flag, Pen, Play, Trash, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { formatDuration } from '@/lib/time'
import { Card, CardContent, CardFooter } from './ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import FastDialog from './fast-dialog'

interface FastListItemProps {
  fast: Fast
  fasts: Fast[]
  onDelete: () => void
  onEdit: (startedAt: Date, endedAt: Date) => void
}

export default function FastListItem({
  fast,
  fasts,
  onDelete,
  onEdit,
}: FastListItemProps) {
  return (
    <Card>
      <CardContent className='space-y-4'>
        <div className='text-center'>
          <p className='text-2xl font-semibold'>
            {formatDuration(
              new Date(fast.endedAt).getTime() -
                new Date(fast.startedAt).getTime(),
            )}
          </p>

          <p className='text-muted-foreground text-sm'>Duration</p>
        </div>

        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Play className='text-muted-foreground mt-0.5 size-4' />
            <div>
              <p className='text-muted-foreground text-xs tracking-wide'>
                Started
              </p>
              <p className='font-medium'>
                {format(new Date(fast.startedAt), 'EEE, PPP p')}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Flag className='text-muted-foreground mt-0.5 size-4' />
            <div>
              <p className='text-muted-foreground text-xs tracking-wide'>
                Ended
              </p>
              <p className='font-medium'>
                {format(new Date(fast.endedAt), 'EEE, PPP p')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className='justify-center gap-2'>
        <FastDialog
          dialogTitle='Edit past fast'
          dialogDescription='Adjust the start and end times for this completed fast. To keep your history accurate, fasts cannot overlap with existing entries.'
          fasts={fasts}
          onSubmit={(startedAt, endedAt) => {
            onEdit(startedAt, endedAt)
          }}
          submitLabel='Edit fast'
          triggerTitle='Edit'
          triggerIcon={Pen}
          initialStartedAt={new Date(fast.startedAt)}
          initialEndedAt={new Date(fast.endedAt)}
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive'>
              <Trash />
              Delete
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia className='bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'>
                <Trash2 />
              </AlertDialogMedia>

              <AlertDialogTitle>Delete fast?</AlertDialogTitle>
              <AlertDialogDescription>
                This fast will be permanently removed from your fasting history.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant='destructive' onClick={onDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
