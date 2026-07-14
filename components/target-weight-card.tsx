'use client'

import TargetWeightCardSkeleton from './skeletons/target-weight-card-skeleton'
import TargetWeightCardContent from './target-weight-card-content'

interface TargetWeightCardProps {
  clear: () => void
  isLoading: boolean
  targetWeight: number | null
  awardXp: (amount: number) => void
  update: (newTarget: number) => void
}

export default function TargetWeightCard({
  isLoading,
  ...rest
}: TargetWeightCardProps) {
  if (isLoading) return <TargetWeightCardSkeleton />

  return <TargetWeightCardContent {...rest} />
}
