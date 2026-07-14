export interface AccordionInfo {
  value: string
  trigger: string
  content: string
}

export type StreakStatus = 'completed' | 'missed' | 'anchored'

export interface LevelDefinition {
  level: number
  requiredXp: number
}

export type AchievementType = 'level' | 'anchor' | 'streak'

export interface Achievement {
  type: AchievementType
  title: string
  description: string
}
