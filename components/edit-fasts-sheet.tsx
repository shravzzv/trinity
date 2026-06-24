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

        <ScrollArea className='min-h-0 flex-1 rounded-md border p-6'>
          {Array.from({ length: 10 }).map((_, index) => (
            <p key={index} className='mb-2 leading-relaxed'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          ))}
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
