import { WifiOff } from 'lucide-react'

export default function OfflinePage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-6 px-8 text-center'>
      <div className='rounded-full border p-4'>
        <WifiOff className='size-8' aria-label='wifi-off' />
      </div>

      <div className='space-y-2'>
        <h1 className='text-2xl font-semibold'>You are offline</h1>

        <p className='text-muted-foreground max-w-md'>
          Trinity can&apos;t reach the internet right now. Any features that
          work offline will continue to be available.
        </p>
      </div>
    </main>
  )
}
