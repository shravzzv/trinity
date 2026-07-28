'use client'

import { AlertCircleIcon, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field'
import { useForm, useWatch } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Spinner } from './ui/spinner'
import { updatePassword } from '@/app/actions'
import PasswordInput from './password-input'

const updatePasswordFormSchema = z.object({
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters long' }),
})

type UpdatePasswordFormSchema = z.infer<typeof updatePasswordFormSchema>

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

export default function UpdatePasswordForm() {
  const [error, setError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdatePasswordFormSchema>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: {
      password: '',
    },
  })

  const { password } = useWatch({ control })

  const onSubmit = async (data: UpdatePasswordFormSchema) => {
    setError(null)

    const formData = new FormData()
    formData.append('password', data.password)

    const result = await updatePassword(formData)

    if (result?.error) {
      if (result.error === 'Auth session missing!') {
        setError(
          'Your password reset link is invalid or has expired. Please request a new password reset email.',
        )
        return
      }

      setError(result.error)
      return
    }
  }

  return (
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
                <KeyRound className='size-6' />
              </div>
              <span className='sr-only'>Update your password</span>
            </div>

            <h1 className='text-xl font-bold'>Update your password</h1>
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
            <PasswordInput control={control} disabled={isSubmitting} />

            <FieldDescription className='text-muted-foreground text-sm'>
              Password should be at least 8 characters long. (
              {password?.length ?? 0}/8)
            </FieldDescription>
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
                'Update password'
              )}
            </Button>
          </Field>
        </FieldGroup>
      </motion.form>
    </motion.div>
  )
}
