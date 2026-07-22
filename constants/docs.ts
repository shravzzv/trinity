import GettingStarted from '@/docs/getting-started.mdx'
import Timer from '@/docs/timer.mdx'
import Plans from '@/docs/plans.mdx'
import Statistics from '@/docs/statistics.mdx'
import Weight from '@/docs/weight.mdx'
import Gamification from '@/docs/gamification.mdx'
import Anchors from '@/docs/anchors.mdx'
import FAQ from '@/docs/faq.mdx'
import Changelog from '@/docs/changelog.mdx'

export const docs = {
  'getting-started': GettingStarted,
  timer: Timer,
  plans: Plans,
  statistics: Statistics,
  weight: Weight,
  gamification: Gamification,
  anchors: Anchors,
  faq: FAQ,
  changelog: Changelog,
} as const

export const docsLinks = [
  {
    title: 'Getting Started',
    href: '/docs/getting-started',
    slug: 'getting-started',
  },
  {
    title: 'Timer',
    href: '/docs/timer',
    slug: 'timer',
  },
  {
    title: 'Plans',
    href: '/docs/plans',
    slug: 'plans',
  },
  {
    title: 'Statistics',
    href: '/docs/statistics',
    slug: 'statistics',
  },
  {
    title: 'Weight',
    href: '/docs/weight',
    slug: 'weight',
  },
  {
    title: 'Gamification',
    href: '/docs/gamification',
    slug: 'gamification',
  },
  {
    title: 'Anchors',
    href: '/docs/anchors',
    slug: 'anchors',
  },
  {
    title: 'FAQ',
    href: '/docs/faq',
    slug: 'faq',
  },
  {
    title: 'Changelog',
    href: '/docs/changelog',
    slug: 'changelog',
  },
]
