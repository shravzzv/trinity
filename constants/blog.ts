import IntroducingTrinity from '@/blog/introducing-trinity.mdx'
import type { BlogPost } from '@/types/blog'

export const blogPosts: BlogPost[] = [
  {
    slug: 'introducing-trinity',
    title: 'Introducing Trinity',
    description:
      'Why I built Trinity and the principles behind an offline-first intermittent fasting tracker.',
    authors: ['Sai Shravan', 'ChatGPT'],
    publishedAt: 'July 25, 2026',
    image: '/blog/introducing-trinity.webp',
    component: IntroducingTrinity,
  },
]
