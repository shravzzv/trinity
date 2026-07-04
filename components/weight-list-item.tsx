'use client'

import { Button } from './ui/button'
import { EllipsisVertical, Pen, Trash, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
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
} from '@/components/ui/alert-dialog'
import type { WeightEntry } from '@/types/weight'
import WeightDialog from './weight-dialog'
import { formatWeight } from '@/lib/weight'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'

interface WeightListItemProps {
  entry: WeightEntry
  onDelete: () => void
  onUpdate: (weightKg: number, recordedAt: Date) => void
}

export default function WeightListItem({
  entry: { weightKg, recordedAt },
  onDelete,
  onUpdate,
}: WeightListItemProps) {
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formatWeight(weightKg)}</CardTitle>
        <CardDescription>{format(recordedAt, 'EEE, PP')}</CardDescription>

        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon-sm'>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setEditing(true)}>
                <Pen />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                variant='destructive'
                onSelect={() => setDeleting(true)}
              >
                <Trash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <WeightDialog
        open={editing}
        onOpenChange={setEditing}
        dialogTitle='Edit weight'
        dialogDescription='Update the recorded weight or date for this entry.'
        submitLabel='Save'
        initialWeight={weightKg}
        initialRecordedAt={new Date(recordedAt)}
        onSave={onUpdate}
      />

      <AlertDialog open={deleting} onOpenChange={setDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className='bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'>
              <Trash2 />
            </AlertDialogMedia>

            <AlertDialogTitle>Delete weight?</AlertDialogTitle>
            <AlertDialogDescription>
              This weight entry will be permanently removed from your weight
              history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={onDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
