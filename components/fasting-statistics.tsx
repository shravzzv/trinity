'use client'

import type {
  Fast,
  FastingPlanId,
  PreferredFastStartTime,
} from '@/types/fasting'
import FastingStatisticsSkeleton from './skeletons/fasting-statistics-skeleton'
import FastingStatisticsContent from './fasting-statistics-content'

interface FastingStatisticsProps {
  fasts: Fast[]
  isLoading: boolean
  planId: FastingPlanId | null
  addFast: (fast: Fast) => Promise<void>
  deleteFast: (id: string) => Promise<void>
  updateFast: (updatedFast: Fast) => Promise<void>
  preferredFastStartTime: PreferredFastStartTime | null
}

export default function FastingStatistics({
  isLoading,
  ...rest
}: FastingStatisticsProps) {
  if (isLoading) return <FastingStatisticsSkeleton />

  return <FastingStatisticsContent {...rest} />
}
