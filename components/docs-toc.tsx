'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { motion } from 'motion/react'
import { useActiveHeading } from '@/hooks/use-active-heading'
import { cn } from '@/lib/utils'

const links = [
  {
    href: '#introduction',
    name: 'Introduction',
  },
  {
    href: '#welcome',
    name: 'Welcome',
  },
  {
    href: '#what-is-trinity',
    name: 'What is Trinity?',
  },
  {
    href: '#why-trinity-exists',
    name: 'Why Trinity exists',
  },
  {
    href: '#who-is-it-for',
    name: 'Who is it for?',
  },
  {
    href: '#offline-first',
    name: 'Offline-first',
  },
  {
    href: '#privacy',
    name: 'Privacy',
  },
  {
    href: '#getting-started',
    name: 'Getting started',
  },
]

interface DocsTOCPros {
  onNavigate?: () => void
}

export default function DocsTOC({ onNavigate }: DocsTOCPros) {
  const activeId = useActiveHeading()

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
            {links.map((link) => {
              const id = link.href.slice(1)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block rounded-md text-sm hover:underline hover:underline-offset-2',
                    id === activeId &&
                      'font-medium underline underline-offset-2',
                  )}
                  onClick={onNavigate}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>
        </CardContent>
      </Card>
    </motion.aside>
  )
}
