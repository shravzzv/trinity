'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useDocumentHeadings } from '@/hooks/use-document-headings'

interface DocsTOCPros {
  onNavigate?: () => void
}

export default function DocsTOC({ onNavigate }: DocsTOCPros) {
  const { headings, activeId } = useDocumentHeadings()

  return (
    <motion.aside
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
      }}
      className='lg:sticky lg:top-16 lg:w-64 lg:px-4 lg:py-1'
    >
      <Card className='rounded-2xl border-0 shadow-none ring-transparent lg:border lg:shadow-lg dark:border-0 dark:shadow-none dark:ring-transparent'>
        <CardHeader className='hidden lg:block'>
          <CardTitle>On this page</CardTitle>
        </CardHeader>

        <CardContent className='max-h-[calc(100svh-12rem)] overflow-y-auto'>
          <nav className='flex flex-col gap-2'>
            {headings.map((heading) => (
              <Link
                key={heading.id}
                href={`#${heading.id}`}
                onClick={onNavigate}
                className={cn(
                  'block rounded-md text-sm hover:underline hover:underline-offset-2',
                  heading.id === activeId &&
                    'font-medium underline underline-offset-2',
                  heading.level === 3 && 'pl-4',
                )}
              >
                {heading.name}
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>
    </motion.aside>
  )
}
