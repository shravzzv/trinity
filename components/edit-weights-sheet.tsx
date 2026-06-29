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
import type { WeightEntry } from '@/types/weight'
import { format } from 'date-fns'

interface EditWeightsSheetProps {
  weightEntries: WeightEntry[]
}

export default function EditWeightsSheet({
  weightEntries,
}: EditWeightsSheetProps) {
  const sortedWeightEntries = [...weightEntries].sort(
    (a, b) =>
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='secondary'>
          <Pen />
          Edit weights
        </Button>
      </SheetTrigger>

      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>Manage weight history</SheetTitle>
          <SheetDescription>
            Review your recorded weights, update incorrect entries, or remove
            entries you no longer want to keep.
          </SheetDescription>
        </SheetHeader>

        {sortedWeightEntries.length === 0 ? (
          <div className='flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center'>
            <p className='font-medium'>No weight entries yet.</p>
            <p className='text-muted-foreground mt-1 text-sm'>
              Record your first weight to start building your history.
            </p>
          </div>
        ) : (
          <ScrollArea className='min-h-0 flex-1 rounded-md'>
            <div className='space-y-2 px-6 py-1'>
              {sortedWeightEntries.map((entry) => (
                <p key={entry.id}>
                  {entry.weightKg} kg, {format(entry.recordedAt, 'EEE, PPP')}
                </p>
              ))}
            </div>
          </ScrollArea>
        )}

        <SheetFooter>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
