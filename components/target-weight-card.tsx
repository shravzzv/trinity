'use client'

import TargetWeightCardSkeleton from './skeletons/target-weight-card-skeleton'
import TargetWeightCardContent from './target-weight-card-content'

interface TargetWeightCardProps {
  isLoading: boolean
  targetWeight: number | null
  update: (newTarget: number) => void
}

export default function TargetWeightCard({
  update,
  isLoading,
  targetWeight,
}: TargetWeightCardProps) {
  if (isLoading) return <TargetWeightCardSkeleton />

  return <TargetWeightCardContent update={update} targetWeight={targetWeight} />
}
