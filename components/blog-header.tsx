'use client'

import type { BlogMetadata } from '@/types/blog'
import { motion } from 'motion/react'
import Image from 'next/image'

interface BlogHeaderProps {
  blog: BlogMetadata
}

export default function BlogHeader({ blog }: BlogHeaderProps) {
  return (
    <header className='space-y-8'>
      <div className='space-y-4 text-center'>
        <motion.h1
          className='text-4xl font-bold tracking-tight md:text-5xl'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {blog.title}
        </motion.h1>

        <motion.p
          className='text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {blog.description}
        </motion.p>

        <motion.p
          className='text-muted-foreground text-sm'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {blog.publishedAt} • {blog.authors.join(', ')}
        </motion.p>
      </div>

      <motion.div
        className='relative overflow-hidden rounded-xl border shadow-sm'
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
      >
        <div className='relative h-56 md:h-80'>
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            priority
            className='object-cover'
          />
        </div>
      </motion.div>
    </header>
  )
}
