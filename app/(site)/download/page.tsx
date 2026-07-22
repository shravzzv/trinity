'use client'

import DownloadCard from '@/components/download-card'
import { motion } from 'motion/react'

export default function Page() {
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
        <DownloadCard index={0} title='Web App' available />
        <DownloadCard index={1} title='Android' />
        <DownloadCard index={2} title='iOS' />
        <DownloadCard index={3} title='Windows' />
        <DownloadCard index={4} title='macOS' />
        <DownloadCard index={5} title='Linux' />
      </div>
    </div>
  )
}
