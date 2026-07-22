'use client'

import { siteLinks } from '@/constants/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import SiteNavbarOverlay from './site-navbar-overlay'

export default function SiteNavbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Prevent background scrolling when menu is open.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Allow escape key to close the menu.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handler)

    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [])

  // Close menu when navigated programatically.
  useEffect(() => {
    ;(() => {
      setIsMenuOpen(false)
    })()
  }, [pathname])

  return (
    <>
      <header className='bg-background/80 sticky top-0 z-50 backdrop-blur-xl'>
        <nav className='mx-auto flex h-16 max-w-6xl items-center px-6'>
          <Link
            href='/'
            className='flex items-center gap-2'
            onClick={() => setIsMenuOpen(false)}
          >
            <Image
              src='/icons/icon-512x512.png'
              alt='Trinity'
              width={32}
              height={32}
              className='rounded-lg'
            />

            <span className='text-lg font-semibold'>Trinity</span>
          </Link>

          <div className='hidden flex-1 justify-center gap-1 lg:flex lg:gap-2'>
            {siteLinks.map((link) => {
              const isActive = pathname.startsWith(link.href)

              return (
                <Button
                  asChild
                  size='lg'
                  key={link.href}
                  className={'text-foreground font-normal'}
                  variant={isActive ? 'secondary' : 'ghost'}
                >
                  <Link href={link.href}>{link.name}</Link>
                </Button>
              )
            })}
          </div>

          <div className='ml-auto flex items-center gap-2'>
            <Button
              asChild
              size='lg'
              variant={pathname.startsWith('/signin') ? 'secondary' : 'ghost'}
              className={'text-foreground hidden font-normal lg:flex'}
            >
              <Link href='/signin'>Sign in</Link>
            </Button>

            <Button asChild size='lg'>
              <Link href='/home'>Get started</Link>
            </Button>

            <Button
              size='icon-lg'
              variant='ghost'
              className='relative lg:hidden'
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <AnimatePresence mode='wait' initial={false}>
                <motion.div
                  key={isMenuOpen ? 'close' : 'menu'}
                  initial={{
                    opacity: 0,
                    rotate: -45,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: 90,
                    scale: 0.8,
                  }}
                  transition={{ duration: 0.15 }}
                  aria-label={
                    isMenuOpen
                      ? 'Close navigation menu'
                      : 'Open navigation menu'
                  }
                >
                  {isMenuOpen ? (
                    <X className='size-5' />
                  ) : (
                    <Menu className='size-5' />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <SiteNavbarOverlay onClose={() => setIsMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
