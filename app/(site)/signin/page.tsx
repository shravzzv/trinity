'use client'

import { motion } from 'motion/react'
import { SigninForm } from '@/components/signin-form'

export default function Page() {
  return (
    <div className='bg-background flex items-start justify-center py-8 md:py-24'>
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
