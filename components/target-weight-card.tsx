'use client'

import { Goal, Pen, Target } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card'
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
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface TargetWeightCardProps {
  targetWeight: number | null
  update: (newTarget: number) => void
}

export default function TargetWeightCard({
  targetWeight,
  update,
}: TargetWeightCardProps) {
  const [input, setInput] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const isValidWeight =
    input !== null && Number.isFinite(input) && input >= 2 && input <= 500
  const hasInvalidWeight = input !== null && !isValidWeight

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight target</CardTitle>

        <CardAction>
          <Dialog
            open={open}
            onOpenChange={(open) => {
              setOpen(open)

              if (open) setInput(targetWeight)
              else setInput(null)
            }}
          >
            <DialogTrigger asChild>
              <Button variant={targetWeight ? 'outline' : 'default'}>
                {targetWeight ? (
                  <>
                    <Pen />
                    Edit
                  </>
                ) : (
                  <>
                    <Goal />
                    Set target
                  </>
                )}
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {targetWeight ? 'Edit' : 'Set'} target weight
                </DialogTitle>

                <DialogDescription>
                  Choose the body weight you&apos;d like to work toward. You can
                  update this milestone at any time as your goals change.
                </DialogDescription>
              </DialogHeader>

              <Field data-invalid={hasInvalidWeight}>
                <FieldLabel htmlFor='target-weight'>Weight</FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    id='target-weight'
                    type='number'
                    step={0.1}
                    min={2}
                    max={500}
                    placeholder='Target weight'
                    autoFocus
                    aria-invalid={hasInvalidWeight}
                    value={input ?? ''}
                    onChange={(e) =>
                      setInput(
                        e.target.value === '' ? null : Number(e.target.value),
                      )
                    }
                  />

                  <InputGroupAddon align='inline-end'>
                    <InputGroupText>kg</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>

                <FieldDescription
                  className={cn(hasInvalidWeight && 'text-destructive')}
                >
                  {hasInvalidWeight
                    ? 'Weight must be between 2 and 500 kg.'
                    : 'Your progress will be tracked against this target.'}
                </FieldDescription>
              </Field>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline' type='button'>
                    Close
                  </Button>
                </DialogClose>

                <Button
                  disabled={hasInvalidWeight}
                  onClick={() => {
                    if (input === null) return
                    update(input)
                    setOpen(false)
                  }}
                >
                  Continue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>

      <CardContent>
        {targetWeight ? (
          <div className='flex items-center gap-2'>
            <Target className='text-muted-foreground size-5 shrink-0' />
            <p className='text-2xl font-semibold'>
              {targetWeight.toFixed(1)} kg
            </p>
          </div>
        ) : (
          <p className='text-muted-foreground text-sm'>
            You haven&apos;t set a target weight yet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
