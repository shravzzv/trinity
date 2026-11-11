/**
 * @fileoverview Contains types associated with gamification.
 */

/**
 * Describes the outcome of a fasting session and its effect on streak progression.
 */
export type StreakStatus = 'completed' | 'missed' | 'anchored'

/**
 * Represents an individual recorded streak outcome.
 */
export interface StreakHistoryItem {
  /** The unique identifier of this streak history item. */
  id: string

  /**
   * The date on which the fasting session ended.
   * Used to determine the corresponding date on the streak calendar.
   */
  date: Date

  /** The outcome of the fasting session. */
  status: StreakStatus

  /** Whether this item is pending synchronization with the remote database. */
  needsSync: boolean
}

/**
 * Represents the current and longest streak calculated from streak history.
 */
export interface StreakCounters {
  /** The number of consecutive successful or anchored fasts in the current streak. */
  currentStreak: number

  /** The greatest number of consecutive successful or anchored fasts recorded. */
  longestStreak: number
}

/**
 * Contains streak history dates grouped by their calendar outcome.
 */
export interface StreakCalendarDates {
  /** Dates on which at least one successful fast was completed. */
  completed: Date[]

  /** Dates on which at least one fast was missed. */
  missed: Date[]

  /** Dates on which an anchor was used for a fast. */
  anchored: Date[]
}

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

export interface AccordionInfo {
  value: string
  trigger: string
  content: string
}
