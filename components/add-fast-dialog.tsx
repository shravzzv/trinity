import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'

export default function AddFastDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='secondary'>
          <Plus />
          Add fast
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add past fast</DialogTitle>

          <DialogDescription>
            Manually add a completed fast to your fasting history. Choose a
            start and end time in the past. To keep your history accurate, fasts
            cannot overlap with existing entries.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Close
            </Button>
          </DialogClose>

          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
