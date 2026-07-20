import Link from 'next/link'

import { DISCORD_INVITE, GITHUB_REPOSITORY_LINK } from '@/constants/links'
import { Separator } from './ui/separator'

export default function SiteFooter() {
  return (
    <footer className='mt-24'>
      <Separator />

      <div className='mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 md:grid-cols-[2fr_1fr_1fr]'>
        <div className='space-y-4'>
          <h2 className='text-2xl font-semibold tracking-tight'>Trinity</h2>

          <p className='text-muted-foreground max-w-sm text-sm leading-relaxed'>
            Designed to stay out of your way, so you can focus on building
            healthy habits.
          </p>
        </div>

        <div className='space-y-4'>
          <h3 className='text-sm font-semibold tracking-wider uppercase'>
            Product
          </h3>

          <nav className='flex flex-col gap-3 text-sm'>
            <Link
              href='/'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Home
            </Link>

            <Link
              href='/features'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Features
            </Link>

            <Link
              href='/download'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Download
            </Link>

            <Link
              href='/docs'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Documentation
            </Link>
          </nav>
        </div>

        <div className='space-y-4'>
          <h3 className='text-sm font-semibold tracking-wider uppercase'>
            Community
          </h3>

          <nav className='flex flex-col gap-3 text-sm'>
            <Link
              href={GITHUB_REPOSITORY_LINK}
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              GitHub
            </Link>

            <Link
              href={DISCORD_INVITE}
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Discord
            </Link>

            <Link
              href='/blog'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Blog
            </Link>

            <Link
              href='/support'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Support
            </Link>
          </nav>
        </div>
      </div>

      <Separator />

      <div className='text-muted-foreground py-6 text-center text-sm'>
        <p>&copy; {new Date().getFullYear()} Trinity. All rights reserved.</p>
      </div>
    </footer>
  )
}
