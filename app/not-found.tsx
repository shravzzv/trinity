import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-4 px-8 text-center'>
      <div className='space-y-2'>
        <h1 className='text-5xl font-bold lg:text-6xl'>404</h1>
        <h2 className='text-xl font-semibold'>Page not found</h2>

        <p className='text-muted-foreground max-w-sm'>
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>
      </div>

      <Button asChild>
        <Link href='/home'>Go home</Link>
      </Button>
    </main>
  )
}
