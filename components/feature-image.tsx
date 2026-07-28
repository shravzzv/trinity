'use client'

import Image from 'next/image'
import { motion, type Variants } from 'motion/react'

interface FeatureImageProps {
  alt: string
  width: number
  height: number
  darkSrc: string
  lightSrc: string
  variants: Variants
}

export function FeatureImage({
  alt,
  width,
  height,
  darkSrc,
  lightSrc,
  variants,
}: FeatureImageProps) {
  return (
    <motion.div
      variants={variants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -2 }}
      className='bg-muted/20 flex items-center justify-center rounded-3xl border p-8'
    >
      <Image
        src={lightSrc}
        alt={alt}
        width={width}
        height={height}
        className='h-auto max-h-130 w-auto rounded-2xl shadow-2xl dark:hidden'
      />

      <Image
        src={darkSrc}
        alt={alt}
        width={width}
        height={height}
        className='hidden h-auto max-h-130 w-auto rounded-2xl shadow-2xl dark:block'
      />
    </motion.div>
  )
}
