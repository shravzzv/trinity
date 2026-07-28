'use client'

import DownloadCard from '@/components/download-card'
import { usePwaInstall } from '@/hooks/use-pwa-install'
import { motion } from 'motion/react'

export default function Page() {
  const { canInstall, install, installed } = usePwaInstall()

  const webDisabled = installed || !canInstall
  const webButtonLabel = installed
    ? 'Installed'
    : canInstall
      ? 'Install'
      : 'Unavailable'

  return (
    <div className='mx-auto flex max-w-5xl flex-col space-y-8 md:py-12'>
      <div className='space-y-2 text-center'>
        <motion.h1
          className='mt-4 text-3xl font-bold tracking-tight sm:text-6xl md:text-7xl'
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Download Trinity
        </motion.h1>

        <motion.p
          className='text-muted-foreground mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed'
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Choose the platform you&apos;d like to install Trinity on.
        </motion.p>
      </div>

      <div className='grid grid-cols-2 gap-4 md:grid-cols-3 md:px-8'>
        <DownloadCard
          index={0}
          title='Web App'
          buttonLabel={webButtonLabel}
          disabled={webDisabled}
          onClick={install}
        />

        <DownloadCard
          index={1}
          title='Android'
          buttonLabel='Coming Soon'
          disabled
        />

        <DownloadCard
          index={2}
          title='iOS'
          buttonLabel='Coming Soon'
          disabled
        />

        <DownloadCard
          index={3}
          title='Windows'
          buttonLabel='Coming Soon'
          disabled
        />

        <DownloadCard
          index={4}
          title='macOS'
          buttonLabel='Coming Soon'
          disabled
        />

        <DownloadCard
          index={5}
          title='Linux'
          buttonLabel='Coming Soon'
          disabled
        />
      </div>
    </div>
  )
}
