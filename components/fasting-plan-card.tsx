'use client'

import { useFastingContext } from '@/providers/fasting-provider'
import FastingPlanCardContent from './fasting-plan-card-content'
import FastingPlanCardSkeleton from './skeletons/fasting-plan-card-skeleton'

export default function FastingPlanCard() {
  const { isLoading } = useFastingContext()

  if (isLoading) return <FastingPlanCardSkeleton />
  return <FastingPlanCardContent />
}
