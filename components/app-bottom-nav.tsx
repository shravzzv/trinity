'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import { appLinks } from '@/constants/navigation'
import { motion } from 'motion/react'

export default function AppBottomNav() {
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className='bg-background fixed bottom-5 left-1/2 z-50 mx-auto flex w-fit -translate-x-1/2 items-center justify-between gap-2 rounded-full border px-2 py-2 shadow-md lg:hidden'
    >
      {appLinks.map((link) => {
        const isActive = pathname.startsWith(link.href)

        return (
          <Link href={link.href} key={link.name}>
            <Button variant={isActive ? 'default' : 'ghost'} size='lg'>
              <link.icon />
              <span>{link.name}</span>
            </Button>
          </Link>
        )
      })}
    </motion.nav>
  )
}
