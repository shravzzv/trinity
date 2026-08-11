'use client'

import { AlertCircleIcon, Pen, UserRoundKey } from 'lucide-react'
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
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { createClient } from '@/supabase/client'
import { FieldGroup } from './ui/field'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Spinner } from './ui/spinner'
import PasswordInput from './password-input'
import { toast } from 'sonner'
import { useNetworkContext } from '@/providers/network-provider'

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters long' }),
})

type PasswordSchema = z.infer<typeof passwordSchema>

export default function SettingsPasswordAlertDialog() {
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const { isOnline } = useNetworkContext()

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
    },
  })

  const onSubmit = async ({ password }: PasswordSchema) => {
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      return
    }

    reset()
    toast.success('Password updated')
    setOpen(false)
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        if (open) return

        reset()
        setError(null)
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setOpen(true)}
          disabled={!isOnline}
        >
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
            Enter your new password. You&apos;ll be signed out of all other
            sessions on updating your password.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <PasswordInput
              control={control}
              disabled={isSubmitting || !isOnline}
            />

            {error && (
              <Alert variant='destructive'>
                <AlertCircleIcon className='h-4 w-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </FieldGroup>

          <AlertDialogFooter className='mt-4'>
            <AlertDialogCancel type='button' onClick={() => setOpen(false)}>
              Close
            </AlertDialogCancel>

            <Button type='submit' disabled={isSubmitting || !isOnline}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  <span>Updating password...</span>
                </>
              ) : (
                <span>Update password</span>
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
