'use client'

import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
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
} from '@/components/ui/alert-dialog'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Separator } from './ui/separator'
import { Spinner } from './ui/spinner'
import { useFastingContext } from '@/providers/fasting-provider'
import { useWeightContext } from '@/providers/weight-provider'

export default function SettingsDataSection() {
  const [isFastingResetLoading, setIsFastingResetLoading] = useState(false)
  const [isWeightResetLoading, setIsWeightResetLoading] = useState(false)
  const [isFastingResetDialogOpen, setIsFastingResetDialogOpen] =
    useState(false)
  const [isWeightResetDialogOpen, setIsWeightResetDialogOpen] = useState(false)

  const { resetFastingProgress } = useFastingContext()
  const { resetWeightProgress } = useWeightContext()

  const handleFastsReset = async () => {
    setIsFastingResetLoading(true)

    try {
      await resetFastingProgress()
      setIsFastingResetDialogOpen(false)
      toast.success('Fasting progress has been reset')
    } finally {
      setIsFastingResetLoading(false)
    }
  }

  const handleWeightsReset = async () => {
    setIsWeightResetLoading(true)

    try {
      await resetWeightProgress()
      setIsWeightResetDialogOpen(false)
      toast.success('Weight progress has been reset')
    } finally {
      setIsWeightResetLoading(false)
    }
  }

  return (
    <section className='space-y-6'>
      <h2 className='font-semibold'>Data</h2>

      <Card>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-base font-medium'>Reset fasting progress</p>
              <p className='text-muted-foreground text-xs'>
                This will remove all your fasting history.
              </p>
            </div>

            <AlertDialog
              open={isFastingResetDialogOpen}
              onOpenChange={(open) => {
                if (!isFastingResetLoading) {
                  setIsFastingResetDialogOpen(open)
                }
              }}
            >
              <AlertDialogTrigger asChild>
                <Button variant='outline' size='sm'>
                  <RotateCcw />
                  Reset
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <RotateCcw />
                  </AlertDialogMedia>

                  <AlertDialogTitle>
                    Reset all your fasting data?
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your fasting data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isFastingResetLoading}>
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    variant='destructive'
                    disabled={isFastingResetLoading}
                    onClick={(event) => {
                      event.preventDefault()
                      void handleFastsReset()
                    }}
                  >
                    {isFastingResetLoading ? (
                      <>
                        <Spinner />
                        Resetting...
                      </>
                    ) : (
                      'Reset fasting data'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <Separator />

          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-base font-medium'>Reset weight progress</p>
              <p className='text-muted-foreground text-xs'>
                This will remove all your weight entries.
              </p>
            </div>

            <AlertDialog
              open={isWeightResetDialogOpen}
              onOpenChange={(open) => {
                if (!isWeightResetLoading) {
                  setIsWeightResetDialogOpen(open)
                }
              }}
            >
              <AlertDialogTrigger asChild>
                <Button variant='outline' size='sm'>
                  <RotateCcw />
                  Reset
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <RotateCcw />
                  </AlertDialogMedia>

                  <AlertDialogTitle>
                    Reset all your weight data?
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your weight data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isWeightResetLoading}>
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    variant='destructive'
                    disabled={isWeightResetLoading}
                    onClick={(event) => {
                      event.preventDefault()
                      void handleWeightsReset()
                    }}
                  >
                    {isWeightResetLoading ? (
                      <>
                        <Spinner />
                        Resetting...
                      </>
                    ) : (
                      'Reset weight data'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
