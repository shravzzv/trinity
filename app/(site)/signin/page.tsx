'use client'

import SigninForm from '@/components/signin-form'
import { motion } from 'motion/react'

export default function Page() {
  return (
    <div className='bg-background flex items-start justify-center py-6 md:py-14'>
      <motion.div
        initial={{
          opacity: 0,
          y: 16,
          scale: 0.985,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.35,
          ease: 'easeOut',
        }}
        className='w-full max-w-sm'
      >
        <SigninForm />
      </motion.div>
    </div>
  )
}
