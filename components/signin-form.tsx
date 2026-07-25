'use client'

import { AlertCircleIcon, GalleryVerticalEnd } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { signin } from '@/app/actions'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import EmailInput from './email-input'
import PasswordInput from './password-input'
import { Spinner } from './ui/spinner'

const signInFormSchema = z.object({
  email: z.email({ error: 'A valid email is required' }),
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters long' }),
})

type SignInFormSchema = z.infer<typeof signInFormSchema>

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

export default function SigninForm() {
  const [error, setError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SignInFormSchema) => {
    setError(null)

    const formData = new FormData()
    formData.set('email', data.email)
    formData.set('password', data.password)

    const result = await signin(formData)

    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        variants={staggerContainer}
        initial='hidden'
        animate='visible'
      >
        <FieldGroup>
          <motion.div
            variants={staggerItem}
            className='flex flex-col items-center gap-2 text-center'
          >
            <div className='flex flex-col items-center gap-2 font-medium'>
              <div className='flex size-8 items-center justify-center rounded-md'>
                <GalleryVerticalEnd className='size-6' />
              </div>

              <span className='sr-only'>Trinity</span>
            </div>

            <h1 className='text-xl font-bold'>Welcome to Trinity</h1>

            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.18,
                ease: 'easeOut',
              }}
            >
              <FieldDescription>
                Don&apos;t have an account? <Link href='/signup'>Sign up</Link>
              </FieldDescription>
            </motion.div>
          </motion.div>

          <motion.div variants={staggerItem}>
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
              <EmailInput control={control} />

              <div className='relative'>
                <PasswordInput control={control} />

                <div className='flex justify-end'>
                  <Link
                    href='/forgot-password'
                    className='text-muted-foreground absolute top-0 right-0 text-sm underline underline-offset-4'
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </motion.div>
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

          <motion.div variants={staggerItem}>
            <Field>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Loading...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </Field>
          </motion.div>

          {/* Separator */}

          <motion.div variants={staggerItem}>
            <FieldSeparator>Or</FieldSeparator>
          </motion.div>

          {/* OAuth */}

          <motion.div variants={staggerItem}>
            <Field className='grid gap-4 sm:grid-cols-2'>
              <Button variant='outline' type='button' disabled={isSubmitting}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                  <path
                    d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                    fill='currentColor'
                  />
                </svg>
                Continue with Google
              </Button>

              <Button variant='outline' type='button' disabled={isSubmitting}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                  <path
                    d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
                    fill='currentColor'
                  />
                </svg>
                Continue with GitHub
              </Button>
            </Field>
          </motion.div>
        </FieldGroup>
      </motion.form>

      <motion.div variants={staggerItem} initial='hidden' animate='visible'>
        <FieldDescription className='px-6 text-center'>
          By clicking continue, you agree to our{' '}
          <Link href='/terms'>Terms of Service</Link> and{' '}
          <Link href='/privacy'>Privacy Policy</Link>.
        </FieldDescription>
      </motion.div>
    </div>
  )
}
