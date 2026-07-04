'use client'

import type { WeightEntry } from '@/types/weight'
import WeightStatisticsSkeleton from './skeletons/weight-statistics-skeleton'
import WeightStatisticsContent from './weight-statistics-content'

interface WeightStatisticsProps {
  isLoading: boolean
  entries: WeightEntry[]
  targetWeight: number | null
  deleteWeight: (id: string) => Promise<void>
  addWeight: (weightKg: number, recordedAt: Date) => Promise<void>
  updateWeight: (updatedWeightEntry: WeightEntry) => Promise<void>
}

export default function WeightStatistics({
  isLoading,
  ...rest
}: WeightStatisticsProps) {
  if (isLoading) return <WeightStatisticsSkeleton />

  return <WeightStatisticsContent {...rest} />
}
