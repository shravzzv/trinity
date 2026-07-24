'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DISCORD_INVITE, SUPPORT_EMAIL } from '@/constants/links'
import { Mail, MessageCircle } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'

const supportOptions = [
  {
    title: 'Email',
    description:
      'Contact support for bugs, account issues, or general questions.',
    icon: Mail,
    href: `mailto:${SUPPORT_EMAIL}`,
    buttonLabel: 'Send Email',
  },
  {
    title: 'Discord',
    description:
      'Join the community to ask questions, report bugs, and share feedback.',
    icon: MessageCircle,
    href: DISCORD_INVITE,
    buttonLabel: 'Join Discord',
    external: true,
  },
]

export default function Page() {
  return (
    <main className='mx-auto max-w-2xl space-y-10 px-6 py-8 md:py-12'>
      <header className='space-y-3 text-center'>
        <motion.h1
          className='text-4xl font-bold tracking-tight md:text-6xl'
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Support
        </motion.h1>

        <motion.p
          className='text-muted-foreground mx-auto max-w-lg text-sm leading-relaxed'
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          Need help with Trinity? Get in touch or join the community.
        </motion.p>
      </header>

      <div className='space-y-4'>
        {supportOptions.map((option, index) => {
          const Icon = option.icon

          return (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.3 + index * 0.08,
              }}
            >
              <Card>
                <CardContent className='flex items-start gap-4 p-6'>
                  <div className='bg-muted flex size-11 shrink-0 items-center justify-center rounded-lg'>
                    <Icon className='size-5' />
                  </div>

                  <div className='flex flex-1 flex-col gap-4'>
                    <div className='space-y-1'>
                      <h2 className='font-semibold'>{option.title}</h2>

                      <p className='text-muted-foreground text-sm leading-relaxed'>
                        {option.description}
                      </p>
                    </div>

                    <Button asChild variant='outline' className='w-fit'>
                      <Link
                        href={option.href}
                        {...(option.external && {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        })}
                      >
                        {option.buttonLabel}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </main>
  )
}
