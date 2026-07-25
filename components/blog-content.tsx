'use client'

import type { BlogMetadata } from '@/types/blog'
import { motion } from 'motion/react'
import BlogHeader from './blog-header'

interface BlogContentProps {
  blog: BlogMetadata
  children: React.ReactNode
}

export default function BlogContent({ blog, children }: BlogContentProps) {
  return (
    <section className='mx-auto max-w-5xl space-y-8 px-6 py-12'>
      <BlogHeader blog={blog} />

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='prose prose-neutral dark:prose-invert prose-pre:rounded-xl prose-pre:border mx-auto max-w-3xl md:py-8'
      >
        {children}
      </motion.article>
    </section>
  )
}
