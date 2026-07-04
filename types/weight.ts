export type WeightStatisticsCadence = 'week' | 'month' | 'year' | 'all'

export interface WeightEntry {
  id: string
  weightKg: number
  recordedAt: string
}
