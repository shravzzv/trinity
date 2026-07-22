'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'motion/react'

interface DownloadCardProps {
  title: string
  index?: number
  available?: boolean
}

export default function DownloadCard({
  title,
  available = false,
  index = 0,
}: DownloadCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: 0.8 + index * 0.08,
      }}
    >
      <Card className='h-full'>
        <CardContent className='flex h-full flex-col items-center gap-6 p-6'>
          <h2 className='text-lg font-semibold tracking-tight'>{title}</h2>

          <Button
            className='w-full'
            variant='outline'
            disabled={!available}
            size='sm'
          >
            {available ? 'Install' : 'Coming Soon'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
