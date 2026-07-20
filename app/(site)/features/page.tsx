'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, type Variants } from 'motion/react'
import Image from 'next/image'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
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
    },
  },
}

const mediaLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -32,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
}

const mediaRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 32,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
}

const textLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -32,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
}

const textRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 32,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function Page() {
  return (
    <main>
      {/* hero */}
      <section className='mx-auto flex max-w-4xl flex-col items-center px-6 py-12 text-center md:py-28'>
        <motion.p
          className='text-primary font-medium'
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Features
        </motion.p>

        <motion.h1
          className='mt-4 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl'
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Everything you need to build consistent fasting habits.
        </motion.h1>

        <motion.p
          className='text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed'
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Trinity combines a beautiful fasting experience with thoughtful tools
          designed to help you stay consistent over the long term. No clutter.
          No distractions. Just the features that matter.
        </motion.p>
      </section>

      {/* timer */}
      <section className='mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 lg:grid-cols-[3fr_2fr]'>
        <div className='relative'>
          <motion.video
            variants={mediaLeftVariants}
            initial='hidden'
            whileInView='visible'
            transition={{ duration: 0.2 }}
            viewport={{ once: true }}
            autoPlay
            muted
            loop
            playsInline
            preload='metadata'
            className='bg-muted aspect-video w-full rounded-2xl object-cover dark:hidden'
          >
            <source src='/videos/fasting-timer-light.mp4' type='video/mp4' />
          </motion.video>

          <motion.video
            variants={mediaLeftVariants}
            initial='hidden'
            whileInView='visible'
            transition={{ duration: 0.2 }}
            viewport={{ once: true }}
            autoPlay
            muted
            loop
            playsInline
            preload='metadata'
            className='bg-muted hidden aspect-video w-full rounded-2xl object-cover shadow-xl dark:block'
          >
            <source src='/videos/fasting-timer-dark.mp4' type='video/mp4' />
          </motion.video>
        </div>

        <motion.div
          variants={textRightVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.25 }}
          className='space-y-6'
        >
          <h2 className='text-4xl font-bold tracking-tight'>
            Track every fast.
          </h2>

          <p className='text-muted-foreground leading-7'>
            Trinity&apos;s fasting timer is designed to stay out of your way
            while keeping you focused on your goals. Start and complete your
            fasts with a clean interface that makes consistency feel effortless.
          </p>

          <motion.ul
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='space-y-3'
          >
            {[
              'Beautiful and distraction-free interface',
              'Works completely offline',
              'Supports multiple fasting schedules',
            ].map((item) => (
              <motion.li
                key={item}
                variants={itemVariants}
                className='flex items-center gap-3'
              >
                <Check className='text-primary size-5 shrink-0' />
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </section>

      {/* Plans */}
      <section className='mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 lg:grid-cols-[2fr_3fr]'>
        <motion.div
          variants={textLeftVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.25 }}
          className='order-2 space-y-6 lg:order-1'
        >
          <h2 className='text-4xl font-bold tracking-tight'>
            Find a schedule that works for you.
          </h2>

          <p className='text-muted-foreground leading-7'>
            Whether you&apos;re beginning with 16:8, following 18:6, or
            practicing OMAD, Trinity helps you choose a fasting schedule that
            fits your lifestyle instead of forcing you into one.
          </p>

          <ul className='space-y-3'>
            {[
              'Popular fasting plans included',
              'Simple plan selection',
              'Switch plans whenever you need',
            ].map((item) => (
              <li key={item} className='flex items-center gap-3'>
                <Check className='text-primary size-5 shrink-0' />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={mediaRightVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ amount: 0.25 }}
          whileHover={{ y: -2 }}
          className='bg-muted/20 order-1 flex items-center justify-center rounded-3xl border p-8 lg:order-2'
        >
          <Image
            src='/screenshots/fasting-plans-light.webp'
            alt='Choose a fasting plan'
            width={588}
            height={699}
            className='h-auto max-h-130 w-auto rounded-2xl shadow-2xl dark:hidden'
          />

          <Image
            src='/screenshots/fasting-plans-dark.webp'
            alt='Choose a fasting plan'
            width={589}
            height={701}
            className='hidden h-auto max-h-130 w-auto rounded-2xl shadow-2xl dark:block'
          />
        </motion.div>
      </section>

      {/* Statistics */}
      <section className='mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 lg:grid-cols-[3fr_2fr]'>
        <motion.div
          variants={mediaLeftVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.25 }}
          whileHover={{ y: -2 }}
          className='bg-muted/20 flex items-center justify-center rounded-3xl border p-8'
        >
          <Image
            src='/screenshots/fasting-statistics-light.webp'
            alt='Fasting statistics'
            width={706}
            height={637}
            className='h-auto max-h-130 w-auto rounded-2xl shadow-2xl dark:hidden'
          />

          <Image
            src='/screenshots/fasting-statistics-dark.webp'
            alt='Fasting statistics'
            width={706}
            height={637}
            className='hidden h-auto max-h-130 w-auto rounded-2xl shadow-2xl dark:block'
          />
        </motion.div>

        <motion.div
          variants={textRightVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.25 }}
          className='space-y-6'
        >
          <h2 className='text-4xl font-bold tracking-tight'>
            Understand your progress.
          </h2>

          <p className='text-muted-foreground leading-7'>
            Every completed fast contributes to a bigger picture. Beautiful
            charts and statistics help you recognize trends, celebrate
            consistency, and stay motivated throughout your journey.
          </p>

          <ul className='space-y-3'>
            {[
              'Fasting history',
              'Completion statistics',
              'Long-term consistency tracking',
            ].map((item) => (
              <li key={item} className='flex items-center gap-3'>
                <Check className='text-primary size-5 shrink-0' />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Weight */}
      <section className='mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 lg:grid-cols-[2fr_3fr]'>
        <motion.div
          variants={textLeftVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.25 }}
          className='order-2 space-y-6 lg:order-1'
        >
          <h2 className='text-4xl font-bold tracking-tight'>
            Track more than your weight.
          </h2>

          <p className='text-muted-foreground leading-7'>
            Weight changes are meaningful over weeks and months—not days.
            Trinity helps you visualize long-term trends with beautiful charts
            that encourage patience instead of daily obsession.
          </p>

          <ul className='space-y-3'>
            {[
              'Weight history',
              'Trend visualization',
              'Long-term progress insights',
            ].map((item) => (
              <li key={item} className='flex items-center gap-3'>
                <Check className='text-primary size-5 shrink-0' />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={mediaRightVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ amount: 0.25 }}
          whileHover={{ y: -2 }}
          className='bg-muted/20 order-1 flex items-center justify-center rounded-3xl border p-8 lg:order-2'
        >
          <Image
            src='/screenshots/weight-statistics-light.webp'
            alt='Choose a fasting plan'
            width={588}
            height={699}
            className='h-auto max-h-130 w-auto rounded-2xl shadow-2xl dark:hidden'
          />

          <Image
            src='/screenshots/weight-statistics-dark.webp'
            alt='Choose a fasting plan'
            width={589}
            height={701}
            className='hidden h-auto max-h-130 w-auto rounded-2xl shadow-2xl dark:block'
          />
        </motion.div>
      </section>

      {/* Gamification */}
      <section className='mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 lg:grid-cols-[3fr_2fr]'>
        <motion.div
          variants={mediaLeftVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.25 }}
          whileHover={{
            scale: 1.01,
            y: -2,
          }}
          className='bg-muted border-border aspect-video rounded-2xl border'
        />

        <motion.div
          variants={textRightVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.25 }}
          className='space-y-6'
        >
          <h2 className='text-4xl font-bold tracking-tight'>Stay motivated.</h2>

          <p className='text-muted-foreground leading-7'>
            Building healthy habits should feel rewarding. Trinity&apos;s
            gamification system celebrates consistency through streaks,
            experience, and levels that grow alongside your fasting journey.
          </p>

          <ul className='space-y-3'>
            {[
              'Build and maintain streaks',
              'Earn experience for completed fasts',
              'Unlock new levels over time',
            ].map((item) => (
              <li key={item} className='flex items-center gap-3'>
                <Check className='text-primary size-5 shrink-0' />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Anchors */}
      <section className='mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 lg:grid-cols-[2fr_3fr]'>
        <motion.div
          variants={textLeftVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.25 }}
          className='order-2 space-y-6 lg:order-1'
        >
          <h2 className='text-4xl font-bold tracking-tight'>
            Protect your streak.
          </h2>

          <p className='text-muted-foreground leading-7'>
            Life happens. Anchors let you preserve your streak when fasting
            simply isn&apos;t possible. Earn anchors through consistent fasting
            and use them when you genuinely need a break—not as a shortcut.
          </p>

          <ul className='space-y-3'>
            {[
              'Earn anchors through consistency',
              'Recover from unavoidable interruptions',
              'Designed to encourage balance, not perfection',
            ].map((item) => (
              <li key={item} className='flex items-center gap-3'>
                <Check className='text-primary size-5 shrink-0' />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={mediaRightVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.25 }}
          whileHover={{
            scale: 1.01,
            y: -2,
          }}
          className='bg-muted border-border order-1 aspect-video rounded-2xl border lg:order-2'
        />
      </section>

      {/* CTA */}
      <section className='mx-auto flex max-w-4xl flex-col items-center px-6 py-12 text-center md:py-28'>
        <motion.h2
          className='text-4xl font-bold tracking-tight sm:text-5xl'
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          Ready to build healthier habits?
        </motion.h2>

        <motion.p
          className='text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed'
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          Start using Trinity today and discover a cleaner, calmer approach to
          intermittent fasting.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <Button asChild size='lg' className='mt-6'>
            <Link href='/home'>Get started</Link>
          </Button>
        </motion.div>
      </section>
    </main>
  )
}
