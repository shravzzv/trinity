'use client'

import FastingPlanCard from '@/components/fasting-plan-card'
import TargetWeightCard from '@/components/target-weight-card'
import { useFastingContext } from '@/providers/fasting-provider'
import { useWeightContext } from '@/providers/weight-provider'
import { useGamificationContext } from '@/providers/gamification-provider'

export default function Page() {
  const {
    planId,
    updatePlanId,
    preferredFastStartTime,
    clearPreferredFastStartTime,
    updatePreferredFastStartTime,
    isLoading: isFastingStateLoading,
  } = useFastingContext()

  const {
    targetWeightKg,
    clearTargetWeight,
    updateTargetWeight,
    isLoading: isWeightStateLoading,
  } = useWeightContext()

  const { awardXp } = useGamificationContext()

  return (
    <div className='space-y-6'>
      <FastingPlanCard
        planId={planId}
        awardXp={awardXp}
        updatePlanId={updatePlanId}
        isLoading={isFastingStateLoading}
        preferredFastStartTime={preferredFastStartTime}
        clearPreferredFastStartTime={clearPreferredFastStartTime}
        updatePreferredFastStartTime={updatePreferredFastStartTime}
      />

      <TargetWeightCard
        awardXp={awardXp}
        clear={clearTargetWeight}
        update={updateTargetWeight}
        targetWeight={targetWeightKg}
        isLoading={isWeightStateLoading}
      />
    </div>
  )
}
