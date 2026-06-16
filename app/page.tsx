import { ThemeToggle } from '@/components/theme-toggle'
import Image from 'next/image'

export default function Home() {
  return (
    <main className='mx-auto max-w-xl px-6 py-6'>
      <header className='flex items-center justify-between'>
        <div className='flex flex-1 items-center gap-4'>
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
    </main>
  )
}
