import { fastingPlans } from '@/constants/fasting-plans'

export type FastingStatus = 'fasting' | 'eating'
export type FastingPlanId = (typeof fastingPlans)[number]['id']

export interface FastingSession {
  status: FastingStatus
  startedAt: string
}

export interface FastingState {
  planId: FastingPlanId
  session: FastingSession | null
}

export interface Fast {
  id: string
  startedAt: string
  endedAt: string
}
