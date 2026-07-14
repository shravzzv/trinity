import type { AccordionInfo, LevelDefinition } from '@/types/gamification'

export const anchorsAccordionInfo: AccordionInfo[] = [
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

export const levelsAccordionInfo: AccordionInfo[] = [
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

/**
 * Level progression in ascending order of required XP.
 *
 * The array must remain sorted by `requiredXp`.
 */
export const levels: LevelDefinition[] = [
  { level: 0, requiredXp: 0 },
  { level: 1, requiredXp: 100 },
  { level: 2, requiredXp: 250 },
  { level: 3, requiredXp: 450 },
  { level: 4, requiredXp: 700 },
  { level: 5, requiredXp: 1000 },
] as const

/**
 * XP awarded for gamified actions throughout the app.
 *
 * These values define Trinity's progression balance and are used by
 * the gamification system when awarding experience points. Only verifiable
 * actions are rewarded. Administrative actions such as modifying history
 * aren't rewarded.
 */
export const xpRewards = {
  // fasting
  missedFast: 2,
  anchoredFast: 4,
  completedFast: 10,
  startedFirstFast: 15,
  selectedFastingPlan: 5,
  setPreferredFastingTime: 5,

  // weight
  setTargetWeight: 10,
  addedWeightEntry: 3,
} as const

export const ANCHOR_STREAK_REQUIREMENT = 7
