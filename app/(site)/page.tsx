'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <div className='flex flex-col items-center gap-6 py-12 text-center md:py-20'>
        <div className='leading-2'>
          <motion.h1
            className='text-5xl leading-tight font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl'
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
            }}
          >
            Track your fasts
            <span className='block'>
              <motion.span
                className='inline-block bg-linear-to-r from-violet-500 via-sky-500 to-violet-500 bg-size-[200%_100%] bg-clip-text text-transparent'
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                beautifully
              </motion.span>
            </span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          A clean, offline-first intermittent fasting tracker designed to help
          you stay consistent.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button asChild size='lg'>
            <Link href='/home'>Get started</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
