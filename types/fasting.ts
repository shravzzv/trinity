import { fastingPlans } from '@/constants/fasting-plans'
import type { StreakStatus } from './gamification'

export type FastingStatus = 'fasting' | 'eating'
export type FastingPlanId = (typeof fastingPlans)[number]['id']
export type FastingStatisticsCadence = 'week' | 'month' | 'year' | 'all'

export interface PreferredFastStartTime {
  hour: number
  minute: number
}

export interface FastingSession {
  status: FastingStatus
  startedAt: string
  isAnchored: boolean
}

export interface FastingPlan {
  id: string
  title: string
  fastingHours: number
  eatingHours: number
}

export interface Fast {
  id: string
  startedAt: string
  endedAt: string
  streakStatus: StreakStatus
  planId: FastingPlanId
}
