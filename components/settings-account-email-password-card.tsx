'use client'

import { useAuthContext } from '@/providers/auth-provider'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import SettingsEmailAlertDialog from './settings-email-alert-dialog'
import { Separator } from './ui/separator'
import SettingsPasswordAlertDialog from './settings-password-alert-dialog'

export default function SettingsAccountEmailPasswordCard() {
  const { session } = useAuthContext()

  const email = session?.user.email
  const isEmailVerified = Boolean(session?.user.email_confirmed_at)

  return (
    <Card>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-base font-medium'>Email</p>
            <p className='text-muted-foreground text-xs'>
              {isEmailVerified
                ? `Your email ${email} has been verified and is active.`
                : 'Your email is unverified.'}
            </p>

            {!isEmailVerified && (
              <Button variant='outline' size='xs'>
                <Send />
                Send verification email
              </Button>
            )}
          </div>

          <SettingsEmailAlertDialog />
        </div>

        <Separator />

        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-base font-medium'>Password</p>
            <p className='text-muted-foreground text-xs'>
              Changing your password will sign you out of other sessions. No one
              except you (even us) can know your password.
            </p>
          </div>

          <SettingsPasswordAlertDialog />
        </div>
      </CardContent>
    </Card>
  )
}
