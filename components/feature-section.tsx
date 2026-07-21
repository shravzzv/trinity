'use client'

import { Check } from 'lucide-react'
import { motion, type Variants } from 'motion/react'
import { ReactNode } from 'react'

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
    },
  },
}

interface FeatureSectionProps {
  title: string
  media: ReactNode
  bullets: string[]
  description: string
  mediaLeft?: boolean
  textVariants: Variants
}

export function FeatureSection({
  title,
  media,
  bullets,
  description,
  textVariants,
  mediaLeft = true,
}: FeatureSectionProps) {
  return (
    <section
      className={`mx-auto grid max-w-6xl items-center gap-16 px-6 py-8 md:py-20 ${
        mediaLeft ? 'lg:grid-cols-[3fr_2fr]' : 'lg:grid-cols-[2fr_3fr]'
      }`}
    >
      {mediaLeft && media}

      <motion.div
        variants={textVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.25 }}
        className={`space-y-6 ${!mediaLeft ? 'order-2 lg:order-1' : ''}`}
      >
        <h2 className='text-4xl font-bold tracking-tight'>{title}</h2>
        <p className='text-muted-foreground leading-7'>{description}</p>

        <motion.ul
          variants={listVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.25 }}
          className='space-y-3'
        >
          {bullets.map((bullet) => (
            <motion.li
              key={bullet}
              variants={listItemVariants}
              className='flex items-center gap-3'
            >
              <Check className='text-primary size-5 shrink-0' />
              <span>{bullet}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      {!mediaLeft && <div className='order-1 lg:order-2'>{media}</div>}
    </section>
  )
}
