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
import WeightListItem from './weight-list-item'
import { toast } from 'sonner'

interface EditWeightsSheetProps {
  weightEntries: WeightEntry[]
  deleteWeight: (id: string) => Promise<void>
  updateWeight: (updatedWeightEntry: WeightEntry) => Promise<void>
}

export default function EditWeightsSheet({
  weightEntries,
  updateWeight,
  deleteWeight,
}: EditWeightsSheetProps) {
  const sortedWeightEntries = [...weightEntries].sort(
    (a, b) =>
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  )

  const handleUpdateWeight = async (
    weightKg: number,
    recordedAt: Date,
    entry: WeightEntry,
  ) => {
    const newWeight: WeightEntry = {
      ...entry,
      weightKg,
      recordedAt: recordedAt.toISOString(),
    }

    try {
      await updateWeight(newWeight)
      toast.success('Weight updated')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  const handleDeleteWeight = async (id: string) => {
    try {
      await deleteWeight(id)
      toast.success('Weight deleted')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

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
              {sortedWeightEntries.map((entry, idx) => {
                const previous = sortedWeightEntries[idx + 1]
                const changeFromPreviousKg =
                  previous === undefined
                    ? null
                    : entry.weightKg - previous.weightKg

                return (
                  <WeightListItem
                    key={entry.id}
                    entry={entry}
                    changeFromPreviousKg={changeFromPreviousKg}
                    onDelete={() => handleDeleteWeight(entry.id)}
                    onUpdate={(...args) => handleUpdateWeight(...args, entry)}
                  />
                )
              })}
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
