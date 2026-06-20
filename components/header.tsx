import Image from 'next/image'
import { ThemeToggle } from './theme-toggle'

export default function Header() {
  return (
    <header className='flex items-center justify-between'>
      <div className='flex flex-1 items-center gap-2'>
        <Image
          src='/icons/icon-512x512.png'
          alt='Trinity'
          width={32}
          height={32}
          className='border-border size-8 rounded-lg border-2'
        />
        <h1 className='text-lg font-semibold'>Trinity</h1>
      </div>

      <div className='shrink-0'>
        <ThemeToggle />
      </div>
    </header>
  )
}
