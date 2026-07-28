'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'motion/react'

interface DownloadCardProps {
  title: string
  index?: number
  disabled?: boolean
  buttonLabel: string
  onClick?: () => void
}

export default function DownloadCard({
  title,
  onClick,
  disabled,
  index = 0,
  buttonLabel,
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
            disabled={disabled}
            size='sm'
            onClick={onClick}
          >
            {buttonLabel}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
