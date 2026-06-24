'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from './ui/button'
import { Pen } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Fast } from '@/types/fasting'
import FastListItem from './fast-list-item'

const fakeFasts: Fast[] = [
  {
    id: '3',
    startedAt: '2026-06-20T18:00:00.000Z',
    endedAt: '2026-06-21T08:00:00.000Z',
  },
  {
    id: '1',
    startedAt: '2026-06-24T18:00:00.000Z',
    endedAt: '2026-06-25T10:00:00.000Z',
  },
  {
    id: '2',
    startedAt: '2026-06-22T20:30:00.000Z',
    endedAt: '2026-06-23T12:30:00.000Z',
  },

  {
    id: '4',
    startedAt: '2026-06-18T19:15:00.000Z',
    endedAt: '2026-06-19T13:15:00.000Z',
  },
  {
    id: '5',
    startedAt: '2026-06-15T18:00:00.000Z',
    endedAt: '2026-06-16T14:00:00.000Z',
  },
]

const sortedFasts = [...fakeFasts].sort(
  (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
)

export default function EditFastsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='secondary'>
          <Pen />
          Edit fasts
        </Button>
      </SheetTrigger>

      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>Manage fasting history</SheetTitle>
          <SheetDescription>
            Review completed fasts, update incorrect entries, or remove fasts
            you no longer want to keep.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className='min-h-0 flex-1 rounded-md'>
          <div className='space-y-2 px-6 py-1'>
            {sortedFasts.map((fast) => (
              <FastListItem key={fast.id} fast={fast} />
            ))}
          </div>
        </ScrollArea>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
