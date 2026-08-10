'use client'

import { FileUp, RotateCcw } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Separator } from './ui/separator'

export default function SettingsDataSection() {
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

            <Button variant='outline' size='sm'>
              <RotateCcw />
              Reset
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

            <Button variant='outline' size='sm'>
              <RotateCcw />
              Reset
            </Button>
          </div>

          <Separator />

          <div className='flex items-center justify-between'>
            <p className='text-base font-medium'>Export your data</p>
            <Button variant='outline' size='sm'>
              <FileUp />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
