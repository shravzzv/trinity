import type {
  FastingPlanId,
  FastingSession,
  PreferredFastStartTime,
} from './fasting'

export interface Profile {
  fastingPlanId: FastingPlanId | null
  fastingSession: FastingSession | null
  preferredFastStartTime: PreferredFastStartTime | null
  targetWeightKg: number | null
  xp: number
  streak: number
  anchors: number
  needsSync: boolean
  lastSyncedAt: string | null
}
