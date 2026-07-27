'use client'

import { motion, type Variants } from 'motion/react'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: 'easeOut',
    },
  },
}

export default function Page() {
  return (
    <div className='flex min-h-[calc(100svh-4rem)] items-center justify-center px-6'>
      <motion.div
        className='w-full max-w-md space-y-6 text-center'
        variants={container}
        initial='hidden'
        animate='visible'
      >
        <motion.div variants={item}>
          <Alert variant='destructive' className='text-left'>
            <AlertCircle className='h-5 w-5' />
            <AlertTitle>Authentication failed</AlertTitle>
            <AlertDescription>
              We couldn&apos;t complete your authentication request. This may be
              due to an invalid link, an expired session, or a temporary issue.
            </AlertDescription>
          </Alert>
        </motion.div>

        <motion.div
          variants={item}
          className='flex flex-col gap-3 sm:flex-row sm:justify-center'
        >
          <Button asChild className='w-full sm:w-auto'>
            <Link href='/signup'>Go to Sign Up</Link>
          </Button>

          <Button asChild variant='outline' className='w-full sm:w-auto'>
            <Link href='/signin'>Go to Sign In</Link>
          </Button>
        </motion.div>

        <motion.p variants={item} className='text-muted-foreground text-sm'>
          Still having trouble? Try contacting{' '}
          <Link href='/support' className='underline underline-offset-4'>
            support
          </Link>{' '}
          or come back later.
        </motion.p>
      </motion.div>
    </div>
  )
}
