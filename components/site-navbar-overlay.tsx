'use client'

import { siteLinks } from '@/constants/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

interface SiteNavbarOverlayProps {
  onClose: () => void
}

const overlayVariants = {
  hidden: {
    opacity: 0,
    y: -12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      staggerChildren: 0.05,
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.25,
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: 'afterChildren',
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: 12,
    transition: {
      duration: 0.15,
    },
  },
}

export default function SiteNavbarOverlay({ onClose }: SiteNavbarOverlayProps) {
  const pathname = usePathname()

  return (
    <motion.div
      className='bg-background/80 fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col gap-6 px-6 py-8 backdrop-blur-xl lg:hidden'
      initial='hidden'
      animate='visible'
      exit='exit'
      variants={overlayVariants}
    >
      <div className='flex flex-col items-start gap-2'>
        {siteLinks.map((link) => {
          const isActive = pathname.startsWith(link.href)

          return (
            <motion.div key={link.href} variants={itemVariants}>
              <Button
                asChild
                size='lg'
                onClick={onClose}
                variant={isActive ? 'secondary' : 'ghost'}
                className='text-foreground justify-start text-xl font-semibold'
              >
                <Link href={link.href}>{link.name}</Link>
              </Button>
            </motion.div>
          )
        })}
      </div>

      <motion.div variants={itemVariants} className='border-t pt-6'>
        <Button
          asChild
          size='lg'
          onClick={onClose}
          variant={pathname.startsWith('/signin') ? 'secondary' : 'ghost'}
          className={cn(
            'text-foreground w-full justify-start text-xl font-semibold',
          )}
        >
          <Link href='/signin'>Sign in</Link>
        </Button>
      </motion.div>
    </motion.div>
  )
}
