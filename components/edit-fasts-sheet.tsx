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
import type { Fast } from '@/types/fasting'
import FastListItem from './fast-list-item'

interface EditFastsSheetProps {
  fasts: Fast[]
}

export default function EditFastsSheet({ fasts }: EditFastsSheetProps) {
  const sortedFasts = [...fasts].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  )

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
