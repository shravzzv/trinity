'use client'

import { useAuthContext } from '@/providers/auth-provider'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import SettingsEmailAlertDialog from './settings-email-alert-dialog'
import { Separator } from './ui/separator'
import SettingsPasswordAlertDialog from './settings-password-alert-dialog'
import { createClient } from '@/supabase/client'
import { toast } from 'sonner'
import { getSiteURL } from '@/lib/links'
import { useNetworkContext } from '@/providers/network-provider'

export default function SettingsAccountEmailPasswordCard() {
  const { session } = useAuthContext()
  const { isOnline } = useNetworkContext()

  const email = session?.user.email
  const newEmail = session?.user.new_email
  const isEmailVerified = Boolean(session?.user.email_confirmed_at)
  const hasPendingEmailChange = Boolean(newEmail)

  const sendVerificationEmail = async (email: string) => {
    const supabase = createClient()
    const emailRedirectTo = `${getSiteURL()}home`

    const { error } = await supabase.auth.resend({
      type: 'email_change',
      email,
      options: { emailRedirectTo },
    })

    if (error) {
      toast.error('Failed to send verification email')
      return
    }

    toast.success('Verification email sent')
  }

  return (
    <Card>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-base font-medium'>Email</p>

            {hasPendingEmailChange ? (
              <>
                <p className='text-muted-foreground text-xs'>
                  Your email {email} is verified and active. A change to{' '}
                  {newEmail} is pending confirmation.
                </p>

                <Button
                  variant='outline'
                  size='xs'
                  disabled={!isOnline}
                  onClick={() => newEmail && sendVerificationEmail(newEmail)}
                >
                  <Send />
                  Resend verification email
                </Button>
              </>
            ) : isEmailVerified ? (
              <p className='text-muted-foreground text-xs'>
                Your email {email} has been verified and is active.
              </p>
            ) : (
              <>
                <p className='text-muted-foreground text-xs'>
                  Your email {email} is unverified.
                </p>

                <Button
                  variant='outline'
                  size='xs'
                  disabled={!isOnline}
                  onClick={() => email && sendVerificationEmail(email)}
                >
                  <Send />
                  Resend verification email
                </Button>
              </>
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
