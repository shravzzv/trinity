'use client'

import { siteLinks } from '@/constants/navigation'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function SiteNavbar() {
  const pathname = usePathname()

  return (
    <header className='sticky top-0 backdrop-blur-xl'>
      <nav className='mx-auto flex h-16 w-full max-w-6xl items-center px-6'>
        <Link href='/' className='flex items-center gap-2'>
          <Image
            src='/icons/icon-512x512.png'
            alt='Trinity'
            width={32}
            height={32}
            className='rounded-lg'
          />

          <span className='text-base font-semibold'>Trinity</span>
        </Link>

        <div className='hidden flex-1 justify-center lg:flex'>
          <div className='flex items-center gap-2'>
            {siteLinks.map((link) => {
              const isActive = pathname.startsWith(link.href)

              return (
                <Button
                  asChild
                  size='lg'
                  variant='link'
                  key={link.href}
                  className={cn(
                    isActive && 'underline',
                    'text-foreground font-normal',
                  )}
                >
                  <Link href={link.href}>{link.name}</Link>
                </Button>
              )
            })}
          </div>
        </div>

        <div className='ml-auto flex items-center gap-2 lg:gap-2'>
          <Button
            asChild
            size='lg'
            variant='link'
            className='text-foreground hidden font-normal lg:flex'
          >
            <Link href='/signin'>Sign in</Link>
          </Button>

          <Button asChild>
            <Link href='/home'>Get started</Link>
          </Button>

          <Button
            variant='ghost'
            size='icon-lg'
            className='lg:hidden'
            aria-label='Open navigation menu'
          >
            <Menu className='size-5' />
          </Button>
        </div>
      </nav>
    </header>
  )
}
