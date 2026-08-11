'use client'

import { Unlink, Link as LinkIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Separator } from './ui/separator'

export default function SettingsAccountLinkingCard() {
  const isGoogleLinked = false
  const isGitHubLinked = false

  return (
    <Card>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <div className='flex-1 space-y-1'>
            <p className='text-base font-medium'>Google</p>
            <p className='text-muted-foreground text-xs'>
              {isGoogleLinked
                ? 'You can sign in to Trinity using Google.'
                : `You'll be able to sign in with Google once connected.`}
            </p>
          </div>
          {isGoogleLinked ? (
            <Button variant='outline' size='sm'>
              <Unlink />
              Disconnect
            </Button>
          ) : (
            <Button variant='outline' size='sm'>
              <LinkIcon />
              Connect
            </Button>
          )}
        </div>

        <Separator />

        <div className='flex items-center justify-between'>
          <div className='flex-1 space-y-1'>
            <p className='text-base font-medium'>GitHub</p>
            <p className='text-muted-foreground text-xs'>
              {isGitHubLinked
                ? 'You can sign in to Trinity using GitHub.'
                : `You'll be able to sign in with GitHub once connected.`}
            </p>
          </div>
          {isGitHubLinked ? (
            <Button variant='outline' size='sm'>
              <Unlink />
              Disconnect
            </Button>
          ) : (
            <Button variant='outline' size='sm'>
              <LinkIcon />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
