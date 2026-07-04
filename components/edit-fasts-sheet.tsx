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
import { toast } from 'sonner'

interface EditFastsSheetProps {
  fasts: Fast[]
  deleteFast: (id: string) => Promise<void>
  updateFast: (updatedFast: Fast) => Promise<void>
}

export default function EditFastsSheet({
  fasts,
  deleteFast,
  updateFast,
}: EditFastsSheetProps) {
  const sortedFasts = [...fasts].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  )

  const handleDeleteFast = async (id: string) => {
    try {
      await deleteFast(id)
      toast.success('Fast deleted')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  const handleUpdateFast = async (
    startedAt: Date,
    endedAt: Date,
    fast: Fast,
  ) => {
    try {
      await updateFast({
        ...fast,
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
      })
      toast.success('Fast updated')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

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

        {sortedFasts.length === 0 ? (
          <div className='flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center'>
            <p className='font-medium'>No completed fasts yet.</p>
            <p className='text-muted-foreground mt-1 text-sm'>
              Completed fasts will appear here once you finish or manually add a
              fast.
            </p>
          </div>
        ) : (
          <ScrollArea className='min-h-0 flex-1 rounded-md'>
            <div className='space-y-2 px-6 py-1'>
              {sortedFasts.map((fast) => (
                <FastListItem
                  key={fast.id}
                  fast={fast}
                  fasts={fasts}
                  onDelete={() => handleDeleteFast(fast.id)}
                  onUpdate={(startedAt, endedAt) =>
                    handleUpdateFast(startedAt, endedAt, fast)
                  }
                />
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
