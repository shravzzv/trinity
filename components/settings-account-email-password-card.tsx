'use client'

import { useAuthContext } from '@/providers/auth-provider'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Pen, Send, UserRoundKey } from 'lucide-react'
import SettingsEmailAlertDialog from './settings-email-alert-dialog'
import { Separator } from './ui/separator'
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
} from './ui/alert-dialog'
import { Input } from './ui/input'

export default function SettingsAccountEmailPasswordCard() {
  const { session } = useAuthContext()

  const email = session?.user.email
  const isEmailVerified = true
  const isPasswordSet = true

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
              {isPasswordSet
                ? 'Changing your password will sign you out of other sessions. No one except you (even us) can know your password.'
                : `You haven't set a password for your account yet.`}
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='outline' size='sm'>
                <Pen />
                Edit
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <UserRoundKey />
                </AlertDialogMedia>

                <AlertDialogTitle>Change Password?</AlertDialogTitle>

                <AlertDialogDescription>
                  Enter your new password. You&apos;ll be signed out of all
                  other sessions on updating your password.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <section>
                <Input
                  type='password'
                  className='text-sm'
                  onChange={() => {}}
                  autoFocus
                />
              </section>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Update password</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
