'use client'

import type { Fast } from '@/types/fasting'
import { Button } from './ui/button'
import { Flag, Pen, Play, Trash } from 'lucide-react'
import { format } from 'date-fns'
import { formatDuration } from '@/lib/time'
import { Card, CardContent, CardFooter } from './ui/card'

interface FastListItemProps {
  fast: Fast
}

export default function FastListItem({ fast }: FastListItemProps) {
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
        <Button variant='secondary'>
          <Pen />
          Edit
        </Button>

        <Button variant='destructive'>
          <Trash />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
