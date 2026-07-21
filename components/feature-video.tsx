'use client'

import { motion, type Variants } from 'motion/react'

interface FeatureVideoProps {
  darkSrc: string
  lightSrc: string
  variants: Variants
}

export function FeatureVideo({
  darkSrc,
  lightSrc,
  variants,
}: FeatureVideoProps) {
  return (
    <div className='bg-background flex items-center justify-center rounded-3xl border p-8'>
      <motion.video
        variants={variants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        autoPlay
        muted
        loop
        playsInline
        preload='metadata'
        className='bg-muted aspect-video w-full rounded-2xl object-cover dark:hidden'
      >
        <source src={lightSrc} />
      </motion.video>

      <motion.video
        variants={variants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        autoPlay
        muted
        loop
        playsInline
        preload='metadata'
        className='bg-muted hidden aspect-video w-full rounded-2xl object-cover dark:block'
      >
        <source src={darkSrc} />
      </motion.video>
    </div>
  )
}
