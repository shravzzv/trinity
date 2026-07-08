'use client'

import type { Fast } from '@/types/fasting'
import { Button } from './ui/button'
import { EllipsisVertical, Flag, Pen, Play, Trash, Trash2 } from 'lucide-react'
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
} from '@/components/ui/alert-dialog'
import FastDialog from './fast-dialog'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import StreakStatusBadge from './streak-status-badge'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'
import { getStreakStatusBorderClasses } from '@/lib/gamification'

interface FastListItemProps {
  fast: Fast
  fasts: Fast[]
  onDelete: () => void
  onUpdate: (startedAt: Date, endedAt: Date) => void
}

export default function FastListItem({
  fast,
  fasts,
  onDelete,
  onUpdate,
}: FastListItemProps) {
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)

  return (
    <Card
      className={cn(
        getStreakStatusBorderClasses(fast.streakStatus),
        'relative',
      )}
    >
      <CardContent className='space-y-4'>
        <div className='space-y-1 text-center'>
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

        <CardFooter className='flex items-center justify-center gap-2'>
          <StreakStatusBadge streakStatus={fast.streakStatus} />
          <Badge variant='outline'>{fast.planId}</Badge>
        </CardFooter>
      </CardContent>

      <div className='absolute top-8 right-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon-sm'>
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setEditing(true)}>
              <Pen />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              variant='destructive'
              onSelect={() => setDeleting(true)}
            >
              <Trash />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <FastDialog
        dialogTitle='Edit past fast'
        dialogDescription='Adjust the start and end times for this completed fast. To keep your history accurate, fasts cannot overlap with existing entries.'
        existingFasts={fasts.filter((f) => f.id !== fast.id)}
        onSubmit={onUpdate}
        submitLabel='Edit fast'
        initialStartedAt={new Date(fast.startedAt)}
        initialEndedAt={new Date(fast.endedAt)}
        open={editing}
        onOpenChange={setEditing}
      />

      <AlertDialog open={deleting} onOpenChange={setDeleting}>
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
    </Card>
  )
}
