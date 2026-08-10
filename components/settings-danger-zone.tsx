'use client'

import { UserX } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

export default function SettingsDangerZone() {
  return (
    <section className='space-y-6'>
      <h2 className='text-destructive font-semibold'>Danger zone</h2>

      <Card>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-base font-medium'>Delete your account</p>
              <p className='text-muted-foreground text-xs'>
                All of your trinity data will be deleted. This is irreversible.
              </p>
            </div>

            <Button variant='destructive' size='sm'>
              <UserX />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
