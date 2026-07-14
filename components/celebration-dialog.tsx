'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface CelebrationDialogProps {
  open: boolean
  title: string
  description: string
  onOpenChange: (open: boolean) => void
}

export default function CelebrationDialog({
  open,
  title,
  description,
  onOpenChange,
}: CelebrationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
