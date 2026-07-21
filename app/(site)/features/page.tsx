'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion, type Variants } from 'motion/react'
import { FeatureSection } from '@/components/feature-section'
import { FeatureVideo } from '@/components/feature-video'
import { FeatureImage } from '@/components/feature-image'

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

      <FeatureSection
        mediaLeft
        title='Track every fast.'
        description="Trinity's fasting timer is designed to stay out of your way while keeping you focused on your goals. Start and complete your fasts with a clean interface that makes consistency feel effortless."
        bullets={[
          'Beautiful and distraction-free interface',
          'Works completely offline',
          'Supports multiple fasting schedules',
        ]}
        textVariants={textRightVariants}
        media={
          <FeatureVideo
            variants={mediaLeftVariants}
            lightSrc='/videos/fasting-timer-light.mp4'
            darkSrc='/videos/fasting-timer-dark.mp4'
          />
        }
      />

      <FeatureSection
        mediaLeft={false}
        title='Find a schedule that works for you.'
        description=" Whether you're beginning with 16:8, following 18:6, or practicing OMAD, Trinity helps you choose a fasting schedule that fits your lifestyle instead of forcing you into one."
        bullets={[
          'Popular fasting plans included',
          'Simple plan selection',
          'Switch plans whenever you need',
        ]}
        textVariants={textLeftVariants}
        media={
          <FeatureImage
            variants={mediaRightVariants}
            lightSrc='/screenshots/fasting-plans-light.webp'
            darkSrc='/screenshots/fasting-plans-dark.webp'
            alt='Choose a fasting plan'
            width={588}
            height={699}
          />
        }
      />

      <FeatureSection
        mediaLeft
        title='Understand your progress.'
        description='Every completed fast contributes to a bigger picture. Beautiful charts and statistics help you recognize trends, celebrate consistency, and stay motivated throughout your journey.'
        bullets={[
          'Fasting history',
          'Completion statistics',
          'Long-term consistency tracking',
        ]}
        textVariants={textRightVariants}
        media={
          <FeatureImage
            variants={mediaLeftVariants}
            lightSrc='/screenshots/fasting-statistics-light.webp'
            darkSrc='/screenshots/fasting-statistics-dark.webp'
            alt='Fasting statistics'
            width={706}
            height={637}
          />
        }
      />

      <FeatureSection
        mediaLeft={false}
        title='Track more than your weight.'
        description='Weight changes are meaningful over weeks and months—not days. Trinity helps you visualize long-term trends with beautiful charts that encourage patience instead of daily obsession.'
        bullets={[
          'Weight history',
          'Trend visualization',
          'Long-term progress insights',
        ]}
        textVariants={textLeftVariants}
        media={
          <FeatureImage
            variants={mediaRightVariants}
            lightSrc='/screenshots/weight-statistics-light.webp'
            darkSrc='/screenshots/weight-statistics-dark.webp'
            alt='Choose a fasting plan'
            width={588}
            height={699}
          />
        }
      />

      <FeatureSection
        mediaLeft
        title='Stay motivated.'
        description="  Building healthy habits should feel rewarding. Trinity's gamification system celebrates consistency through streaks, experience, and levels that grow alongside your fasting journey."
        bullets={[
          'Build and maintain streaks',
          'Earn experience for completed fasts',
          'Unlock new levels over time',
        ]}
        textVariants={textRightVariants}
        media={
          <FeatureImage
            variants={mediaLeftVariants}
            lightSrc='/screenshots/streak-dialog-light.webp'
            darkSrc='/screenshots/streak-dialog-dark.webp'
            alt='Fasting statistics'
            width={706}
            height={637}
          />
        }
      />

      <FeatureSection
        mediaLeft={false}
        title='Protect your streak.'
        description="Life happens. Anchors let you preserve your streak when fasting simply isn't possible. Earn anchors through consistent fasting and use them when you genuinely need a break—not as a shortcut."
        bullets={[
          'Earn anchors through consistency',
          'Recover from unavoidable interruptions',
          'Designed to encourage balance, not perfection',
        ]}
        textVariants={textLeftVariants}
        media={
          <FeatureImage
            variants={mediaRightVariants}
            lightSrc='/screenshots/anchors-dialog-light.webp'
            darkSrc='/screenshots/anchors-dialog-dark.webp'
            alt='Choose a fasting plan'
            width={588}
            height={699}
          />
        }
      />

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
