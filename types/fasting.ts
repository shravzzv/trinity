import { fastingPlans } from '@/constants/fasting-plans'

export type FastingStatus = 'fasting' | 'eating'
export type FastingPlanId = (typeof fastingPlans)[number]['id']
export type FastingStatisticsCadence = 'week' | 'month' | 'year' | 'all'

export interface FastingSession {
  status: FastingStatus
  startedAt: string
}

export interface Fast {
  id: string
  startedAt: string
  endedAt: string
}

export interface PreferredFastStartTime {
  hour: number
  minute: number
}
