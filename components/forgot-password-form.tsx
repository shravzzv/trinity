'use client'

import { AlertCircleIcon, Lock, MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import EmailInput from './email-input'
import { Spinner } from './ui/spinner'
import { sendPasswordResetEmail } from '@/app/actions'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from './ui/alert-dialog'

const forgotPasswordFormSchema = z.object({
  email: z.email({ error: 'A valid email is required' }),
})

type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordFormSchema>

const variants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },

  animate: {
    opacity: 1,
    y: 0,
  },
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.06,
    },
  },
}

const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [showConfirmEmail, setShowConfirmEmail] = useState(false)

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormSchema) => {
    setError(null)
    setShowConfirmEmail(false)

    const formData = new FormData()
    formData.set('email', data.email)

    const result = await sendPasswordResetEmail(formData)

    if (result?.error) {
      setError(result.error)
      return
    }

    setSubmittedEmail(data.email)
    setShowConfirmEmail(true)
    reset()
  }

  return (
    <>
      <motion.div
        className='flex flex-col gap-6'
        variants={staggerContainer}
        initial='hidden'
        animate='visible'
      >
        <motion.form onSubmit={handleSubmit(onSubmit)} variants={staggerItem}>
          <FieldGroup>
            <div className='flex flex-col items-center gap-2 text-center'>
              <div className='flex flex-col items-center gap-2 font-medium'>
                <div className='flex size-8 items-center justify-center rounded-md'>
                  <Lock className='size-6' />
                </div>

                <span className='sr-only'>Reset your passwod</span>
              </div>

              <h1 className='text-xl font-bold'>Reset your password</h1>

              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.18,
                  ease: 'easeOut',
                }}
              >
                <FieldDescription className='text-center'>
                  Remembered your password? <Link href='/signin'>Sign in</Link>
                </FieldDescription>
              </motion.div>
            </div>

            <motion.div
              variants={variants}
              initial='initial'
              animate='animate'
              transition={{
                duration: 0.22,
                ease: 'easeInOut',
              }}
              className='space-y-4'
            >
              <EmailInput control={control} disabled={isSubmitting} />
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  <Alert variant='destructive'>
                    <AlertCircleIcon className='h-4 w-4' />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <Field>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Loading...
                  </>
                ) : (
                  'Send password reset link'
                )}
              </Button>
            </Field>
          </FieldGroup>
        </motion.form>
      </motion.div>

      <AlertDialog open={showConfirmEmail}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <MailCheck />
            </AlertDialogMedia>
            <AlertDialogTitle>Check your email</AlertDialogTitle>
            <AlertDialogDescription>
              We&apos;ve sent a password reset email to{' '}
              <span className='font-semibold'>{submittedEmail}</span>. Open the
              email and click the verification link to reset your password. You
              can safely close this page while you check your inbox.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
