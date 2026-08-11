'use client'

import { AlertCircleIcon, Mail, Pen } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog'
import { Button } from './ui/button'
import { useAuthContext } from '@/providers/auth-provider'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { createClient } from '@/supabase/client'
import { FieldGroup } from './ui/field'
import EmailInput from './email-input'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Spinner } from './ui/spinner'
import { getSiteURL } from '@/lib/links'
import { useNetworkContext } from '@/providers/network-provider'

const emailSchema = z.object({
  email: z.email({ error: 'A valid email is required' }),
})
type EmailSchema = z.infer<typeof emailSchema>

export default function SettingsEmailAlertDialog() {
  const [error, setError] = useState<string | null>(null)
  const [showConfirmEmail, setShowConfirmEmail] = useState(false)

  const { isOnline } = useNetworkContext()
  const { session } = useAuthContext()
  const email = session?.user.email

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email,
    },
  })

  const onSubmit = async ({ email }: EmailSchema) => {
    setError(null)

    const supabase = createClient()
    const emailRedirectTo = `${getSiteURL()}home`

    const { error } = await supabase.auth.updateUser(
      { email },
      { emailRedirectTo },
    )

    if (error) {
      setError(error.message)
      return
    }

    setShowConfirmEmail(true)
    reset()
  }

  return (
    <AlertDialog
      onOpenChange={(open) => {
        if (open) return

        reset({ email })
        setError(null)
        setShowConfirmEmail(false)
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant='outline' size='sm' disabled={!isOnline}>
          <Pen />
          Edit
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Mail />
          </AlertDialogMedia>

          <AlertDialogTitle>Change email?</AlertDialogTitle>
          <AlertDialogDescription>
            Enter your new email address. A confirmation email will be sent to
            your new email for verification.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <EmailInput
              control={control}
              disabled={isSubmitting || showConfirmEmail || !isOnline}
            />

            {error && (
              <Alert variant='destructive'>
                <AlertCircleIcon className='h-4 w-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {showConfirmEmail && (
              <Alert>
                <AlertCircleIcon className='h-4 w-4' />
                <AlertTitle>Confirmation email sent</AlertTitle>
                <AlertDescription>
                  Please check your inbox to confirm your new email.
                </AlertDescription>
              </Alert>
            )}
          </FieldGroup>

          <AlertDialogFooter className='mt-4'>
            <AlertDialogCancel type='button'>
              {showConfirmEmail ? 'Close' : 'Cancel'}
            </AlertDialogCancel>

            <Button
              type='submit'
              disabled={isSubmitting || showConfirmEmail || !isOnline}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  <span>Updating email...</span>
                </>
              ) : (
                <span>Update email</span>
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
