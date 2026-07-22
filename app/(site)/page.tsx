'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { GitPullRequestArrow, Tag, UserLock, WifiOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, type Variants } from 'motion/react'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },
}

export default function Page() {
  return (
    <div>
      <div className='flex flex-col items-center gap-6 py-12 text-center md:py-20'>
        <div className='leading-2'>
          <motion.h1
            className='text-5xl leading-tight font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl'
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
            }}
          >
            Track your fasts
            <span className='block'>
              <motion.span
                className='inline-block bg-linear-to-r from-violet-500 via-sky-500 to-violet-500 bg-size-[200%_100%] bg-clip-text text-transparent'
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                beautifully
              </motion.span>
            </span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          A clean, offline-first intermittent fasting tracker designed to help
          you stay consistent.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button asChild size='lg'>
            <Link href='/home'>Get started</Link>
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 32,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          delay: 0.45,
          duration: 0.6,
          ease: 'easeOut',
        }}
      >
        <div className='relative mx-auto max-w-6xl px-6'>
          <div className='absolute inset-0 -z-10 rounded-full bg-blue-500/10 blur-3xl' />
          <Image
            src={'/screenshots/hero-banner-desktop-light.webp'}
            alt='hero'
            width={1920}
            height={911}
            loading='eager'
            className='border-border z-10 mx-auto hidden w-full max-w-6xl rounded-2xl border shadow-2xl md:block dark:hidden'
          />
          <Image
            src={'/screenshots/hero-banner-desktop-dark.webp'}
            alt='hero'
            width={1920}
            height={911}
            loading='eager'
            className='border-border z-10 mx-auto hidden w-full max-w-6xl rounded-2xl border shadow-2xl dark:hidden md:dark:block'
          />
          <Image
            src={'/screenshots/hero-banner-mobile-light.webp'}
            alt='hero'
            width={1078}
            height={2216}
            loading='eager'
            className='border-border z-10 mx-auto block w-full max-w-sm rounded-2xl border shadow-2xl md:hidden dark:hidden'
          />
          <Image
            src={'/screenshots/hero-banner-mobile-dark.webp'}
            alt='hero'
            width={1080}
            height={2216}
            loading='eager'
            className='border-border z-10 mx-auto hidden w-full max-w-sm rounded-2xl border shadow-2xl md:hidden dark:block dark:md:hidden'
          />
        </div>
      </motion.div>

      <section className='mx-auto w-full max-w-6xl space-y-12 px-6 py-20 pb-0 md:p-28 md:pb-0'>
        <motion.h2
          initial={{
            opacity: 0,
            y: 16,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.8,
          }}
          className='text-center text-3xl font-bold tracking-tight md:text-6xl'
        >
          Built for consistency.
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className='grid gap-6 md:grid-cols-2'
        >
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className='space-y-3'>
                <CardTitle className='flex items-center gap-2'>
                  <div className='bg-primary/10 text-primary rounded-xl p-2'>
                    <WifiOff className='size-6' />
                  </div>
                  <span>Offline first</span>
                </CardTitle>
                <CardDescription>
                  Keep tracking even without an internet connection. Your data
                  is always available when you need it.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className='space-y-3'>
                <CardTitle className='flex items-center gap-2'>
                  <div className='bg-primary/10 text-primary rounded-xl p-2'>
                    <Tag className='text-primary size-6' />
                  </div>
                  <span>No ads</span>
                </CardTitle>
                <CardDescription>
                  Stay focused on your fasts without interruptions, banners, or
                  distractions.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className='space-y-3'>
                <CardTitle className='flex items-center gap-2'>
                  <div className='bg-primary/10 text-primary rounded-xl p-2'>
                    <UserLock className='text-primary size-6' />
                  </div>
                  <span>Privacy focused</span>
                </CardTitle>
                <CardDescription>
                  Your fasting journey belongs to you. Trinity is designed with
                  privacy in mind.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className='space-y-3'>
                <CardTitle className='flex items-center gap-2'>
                  <div className='bg-primary/10 text-primary rounded-xl p-2'>
                    <GitPullRequestArrow className='text-primary size-6' />
                  </div>
                  <span>Open source</span>
                </CardTitle>
                <CardDescription>
                  Built transparently with a public codebase, where anyone can
                  inspect the source and contribute improvements.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
