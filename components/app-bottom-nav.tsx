'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import { appLinks } from '@/constants/navigation'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export default function AppBottomNav() {
  const pathname = usePathname()

  return (
    <motion.nav
      aria-label='primary-navigation'
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className='bg-background/50 fixed bottom-5 left-1/2 z-50 mx-auto flex w-fit -translate-x-1/2 items-center justify-between gap-2 rounded-full border px-2 py-2 shadow-lg backdrop-blur-xl md:hidden'
    >
      {appLinks.map((link) => {
        const isActive = pathname.startsWith(link.href)

        return (
          <Button
            asChild
            size='lg'
            variant='ghost'
            key={link.name}
            className={cn(isActive && 'text-primary-foreground', 'relative')}
          >
            <Link href={link.href} aria-current={isActive ? 'page' : undefined}>
              {isActive && (
                <motion.div
                  layoutId='bottom-nav-active'
                  className='bg-primary absolute inset-0 rounded-full'
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <link.icon className='relative z-10' />
              <span className='relative z-10'>{link.name}</span>
            </Link>
          </Button>
        )
      })}
    </motion.nav>
  )
}
