'use client'

import { siteLinks } from '@/constants/navigation'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from './ui/button'

export default function SiteNavbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      {/* Desktop navbar */}
      <header className='bg-background/80 sticky top-0 z-50 hidden backdrop-blur-xl lg:block'>
        <nav className='mx-auto flex h-16 max-w-6xl items-center px-6'>
          <Link href='/' className='flex items-center gap-2'>
            <Image
              src='/icons/icon-512x512.png'
              alt='Trinity'
              width={32}
              height={32}
              className='rounded-lg'
            />

            <span className='font-semibold'>Trinity</span>
          </Link>

          <div className='flex flex-1 justify-center gap-2'>
            {siteLinks.map((link) => {
              const isActive = pathname.startsWith(link.href)

              return (
                <Button
                  key={link.href}
                  asChild
                  variant='link'
                  size='lg'
                  className={cn(
                    'text-foreground font-normal',
                    isActive && 'underline',
                  )}
                >
                  <Link href={link.href}>{link.name}</Link>
                </Button>
              )
            })}
          </div>

          <div className='flex items-center gap-2'>
            <Button
              asChild
              variant='link'
              size='lg'
              className='text-foreground font-normal'
            >
              <Link href='/signin'>Sign in</Link>
            </Button>

            <Button asChild>
              <Link href='/home'>Get started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile navigation */}
      <AnimatePresence mode='wait'>
        {!isMenuOpen ? (
          <motion.header className='bg-background/80 sticky top-0 z-50 backdrop-blur-xl lg:hidden'>
            <nav className='mx-auto flex h-16 items-center px-6'>
              <Link href='/' className='flex items-center gap-2'>
                <Image
                  src='/icons/icon-512x512.png'
                  alt='Trinity'
                  width={32}
                  height={32}
                  className='rounded-lg'
                />

                <span className='font-semibold'>Trinity</span>
              </Link>

              <div className='ml-auto flex items-center gap-2'>
                <Button asChild>
                  <Link href='/home'>Get started</Link>
                </Button>

                <Button
                  variant='ghost'
                  size='icon-lg'
                  aria-label='Open navigation menu'
                  onClick={() => setIsMenuOpen(true)}
                >
                  <Menu className='size-5' />
                </Button>
              </div>
            </nav>
          </motion.header>
        ) : (
          <motion.div className='bg-background fixed inset-0 z-50 flex flex-col lg:hidden'>
            {/* Header */}
            <header>
              <nav className='mx-auto flex h-16 items-center px-6'>
                <Link
                  href='/'
                  onClick={closeMenu}
                  className='flex items-center gap-2'
                >
                  <Image
                    src='/icons/icon-512x512.png'
                    alt='Trinity'
                    width={32}
                    height={32}
                    className='rounded-lg'
                  />

                  <span className='font-semibold'>Trinity</span>
                </Link>

                <div className='ml-auto flex items-center gap-2'>
                  <Button asChild>
                    <Link href='/home' onClick={closeMenu}>
                      Get started
                    </Link>
                  </Button>

                  <Button
                    size='icon-lg'
                    variant='ghost'
                    onClick={closeMenu}
                    aria-label='Close navigation menu'
                  >
                    <X className='size-5' />
                  </Button>
                </div>
              </nav>
            </header>

            <motion.div
              initial='hidden'
              animate='visible'
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.05 },
                },
              }}
              className='flex flex-1 flex-col px-6 py-8'
            >
              {siteLinks.map((link) => {
                const isActive = pathname.startsWith(link.href)

                return (
                  <motion.div
                    key={link.href}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 12,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                      },
                    }}
                  >
                    <Button
                      asChild
                      size='lg'
                      variant={isActive ? 'secondary' : 'ghost'}
                      className='mb-1 w-full justify-start text-lg'
                    >
                      <Link href={link.href} onClick={closeMenu}>
                        {link.name}
                      </Link>
                    </Button>
                  </motion.div>
                )
              })}

              <div className='mt-6 border-t pt-6'>
                <Button
                  asChild
                  size='lg'
                  variant='ghost'
                  className='w-full justify-start text-lg'
                >
                  <Link href='/signin' onClick={closeMenu}>
                    Sign in
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
