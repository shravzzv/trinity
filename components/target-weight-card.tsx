'use client'

import { useWeightContext } from '@/providers/weight-provider'
import TargetWeightCardSkeleton from './skeletons/target-weight-card-skeleton'
import TargetWeightCardContent from './target-weight-card-content'

export default function TargetWeightCard() {
  const { isLoading } = useWeightContext()

  if (isLoading) return <TargetWeightCardSkeleton />
  return <TargetWeightCardContent />
}
