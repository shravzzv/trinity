export type WeightStatisticsCadence = 'week' | 'month' | 'year' | 'all'

export interface WeightState {
  targetWeightKg: number | null
  entries: WeightEntry[]
}

export interface WeightEntry {
  id: string
  weightKg: number
  recordedAt: string
}
