'use client'

import BlogCard from '@/components/blog-card'
import { motion, Variants } from 'motion/react'

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.6,
      staggerChildren: 0.08,
    },
  },
}

export default function Page() {
  return (
    <section className='mx-auto max-w-5xl space-y-12 px-6 py-8 md:py-12'>
      <header className='space-y-3 text-center'>
        <motion.h1
          className='text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl'
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Trinity blog
        </motion.h1>

        <motion.p
          className='text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed'
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Thoughts, announcements and development updates.
        </motion.p>
      </header>

      <motion.div
        variants={container}
        initial='hidden'
        animate='show'
        className='grid gap-6 md:grid-cols-2'
      >
        <BlogCard
          title='Introducing Trinity'
          description='Why I built Trinity and the principles behind an offline-first intermittent fasting tracker.'
          image='/blog/introducing-trinity.webp'
          href='/blog/introducing-trinity'
          authors={['Sai Shravan', 'ChatGPT']}
          publishedAt='August 2, 2026'
        />
      </motion.div>
    </section>
  )
}
