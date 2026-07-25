'use client'

import { Card, CardContent } from '@/components/ui/card'
import { motion, Variants } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
    },
  },
}

interface BlogCardProps {
  href: string
  title: string
  image: string
  authors: string[]
  description: string
  publishedAt: string
}

export default function BlogCard({
  href,
  title,
  image,
  authors,
  description,
  publishedAt,
}: BlogCardProps) {
  return (
    <motion.div variants={item}>
      <Link
        href={href}
        className='focus-visible:ring-ring block rounded-xl focus-visible:ring-2 focus-visible:outline-none'
      >
        <Card className='group hover:border-primary/30 overflow-hidden pt-0 transition-colors'>
          <div className='relative h-36 w-full overflow-hidden'>
            <Image
              fill
              src={image}
              alt={title}
              className='object-cover transition-transform duration-300 group-hover:scale-[1.03]'
            />
          </div>

          <CardContent>
            <div className='space-y-3'>
              <div className='space-y-2'>
                <h2 className='text-xl font-semibold tracking-tight'>
                  {title}
                </h2>

                <p className='text-muted-foreground line-clamp-3 text-sm leading-relaxed'>
                  {description}
                </p>
              </div>

              <p className='text-muted-foreground text-xs'>
                {authors.join(', ')}.
              </p>

              <p className='text-muted-foreground text-xs'>{publishedAt}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
