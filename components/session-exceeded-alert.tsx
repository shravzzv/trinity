'use client'

import { formatRelativeDay } from '@/lib/time'
import { Alert, AlertAction, AlertDescription, AlertTitle } from './ui/alert'
import { Button } from './ui/button'

interface SessionExceededAlertProps {
  selectedEndedAt: Date | undefined
  openDrawer: () => void
}

export default function SessionExceededAlert({
  selectedEndedAt,
  openDrawer,
}: SessionExceededAlertProps) {
  return (
    <Alert>
      <AlertTitle>Finished earlier?</AlertTitle>
      <AlertDescription className='flex flex-col gap-2'>
        {selectedEndedAt ? (
          <div>
            <span>
              Finish time:{' '}
              <span className='font-medium'>
                {selectedEndedAt.toLocaleTimeString()}
              </span>{' '}
            </span>

            <span className='font-medium'>
              {formatRelativeDay(selectedEndedAt)}.
            </span>
          </div>
        ) : (
          <span>
            Update the finish time before continuing. The present time will be
            used by default if you continue.
          </span>
        )}
      </AlertDescription>

      <AlertAction>
        <Button size='xs' variant='outline' onClick={openDrawer}>
          Update time
        </Button>
      </AlertAction>
    </Alert>
  )
}
