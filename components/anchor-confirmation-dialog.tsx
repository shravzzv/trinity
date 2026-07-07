'use client'

import { Anchor } from 'lucide-react'
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
} from './ui/alert-dialog'
import { Button } from './ui/button'

export default function AnchorConfirmationDialog() {
  const anchorsAvailable: number = 1
  const handleSubmit = () => {}

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='outline' size='sm' disabled={anchorsAvailable === 0}>
          <Anchor />
          {anchorsAvailable > 0 ? 'Use Anchor' : 'No Anchors available'}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Anchor />
          </AlertDialogMedia>

          <AlertDialogTitle>Use an Anchor?</AlertDialogTitle>

          <AlertDialogDescription className='flex flex-col gap-1 space-y-2'>
            <span>
              You can use an Anchor to safely skip a fast while maintaining your
              fasting streak. This turns the fasting session into an eating
              window. This action is irreversible.
            </span>

            <span>
              You can start a fast anytime while using an Anchor. A regular
              eating window follows this anchored fast per your plan.
            </span>

            <span>
              Earliest next fast is
              <span className='font-medium'> 6:00 p.m. tomorrow</span> unless
              started earlier.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={handleSubmit}>
            Use Anchor
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
