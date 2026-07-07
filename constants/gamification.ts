import type { AccordionInfo } from '@/types/gamification'

export const anchorsInfo: AccordionInfo[] = [
  {
    value: 'what',
    trigger: 'What are Anchors?',
    content: `Anchors let you preserve your streak after missing a fast. Using an Anchor consumes one and keeps your streak uninterrupted. If you don't have an Anchor available, missing a fast will end your current streak.`,
  },
  {
    value: 'when',
    trigger: 'When should I use one?',
    content: `Use an Anchor when an unexpected event causes you to miss a fast. They're intended as a safety net for exceptional circumstances, not everyday use.`,
  },
  {
    value: 'earn',
    trigger: 'How do I earn more?',
    content:
      'Earn an Anchor by completing a streak of seven successful fasts or by reaching new levels. Your progress toward the next Anchor is shown above.',
  },
]

export const levelsInfo: AccordionInfo[] = [
  {
    value: 'about',
    trigger: 'About levels',
    content:
      'Levels represent your long-term progress in Trinity. Earn XP through consistent fasting and other activities to reach new levels.',
  },
  {
    value: 'earning',
    trigger: 'Earning XP',
    content:
      'Earn XP by completing fasts and achieving milestones. New ways to earn XP may be added over time.',
  },
  {
    value: 'rewards',
    trigger: 'Level rewards',
    content:
      'Reaching new levels unlocks rewards such as Anchors and celebrates your long-term consistency.',
  },
]
