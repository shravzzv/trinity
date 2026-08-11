'use client'

import { RotateCcw } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Separator } from './ui/separator'
import { useFastingContext } from '@/providers/fasting-provider'
import { useState } from 'react'
import { Spinner } from './ui/spinner'
import { useWeightContext } from '@/providers/weight-provider'
import { toast } from 'sonner'

export default function SettingsDataSection() {
  const [isFastingResetLoading, setIsFastingResetLoading] = useState(false)
  const [isWeightsResetLoading, setIsWeightsResetLoading] = useState(false)

  const { resetFastingProgress } = useFastingContext()
  const { resetWeightProgress } = useWeightContext()

  const handleFastsReset = async () => {
    setIsFastingResetLoading(true)

    try {
      await resetFastingProgress()
      toast.success('Fasting progress has been reset')
    } finally {
      setIsFastingResetLoading(false)
    }
  }

  const handleWeightsReset = async () => {
    setIsWeightsResetLoading(true)

    try {
      await resetWeightProgress()
      toast.success('Weight progress has been reset')
    } finally {
      setIsWeightsResetLoading(false)
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

            <Button
              variant='outline'
              size='sm'
              onClick={handleFastsReset}
              disabled={isFastingResetLoading}
            >
              {isFastingResetLoading ? (
                <>
                  <Spinner />
                  Resetting...
                </>
              ) : (
                <>
                  <RotateCcw />
                  Reset
                </>
              )}
            </Button>
          </div>

          <Separator />

          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-base font-medium'>Reset weight progress</p>
              <p className='text-muted-foreground text-xs'>
                This will remove all your weight entries.
              </p>
            </div>

            <Button
              variant='outline'
              size='sm'
              onClick={handleWeightsReset}
              disabled={isWeightsResetLoading}
            >
              {isWeightsResetLoading ? (
                <>
                  <Spinner />
                  Resetting...
                </>
              ) : (
                <>
                  <RotateCcw />
                  Reset
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
