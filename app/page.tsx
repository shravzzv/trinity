'use client'

import FastingPlanCard from '@/components/fasting-plan-card'
import FastingStatistics from '@/components/fasting-statistics'
import FastingTimer from '@/components/fasting-timer'
import Header from '@/components/header'
import FastingPlanCardSkeleton from '@/components/skeletons/fasting-plan-card-skeleton'
import FastingTimerSkeleton from '@/components/skeletons/fasting-timer-skeleton'
import TargetWeightCard from '@/components/target-weight-card'
import WeightStatistics from '@/components/weight-statistics'
import { useFasting } from '@/hooks/use-fasting'
import { useWeight } from '@/hooks/use-weight'

export default function Page() {
  const {
    planId,
    session,
    fasts,
    endFasting,
    startFasting,
    updatePlanId,
    addFast,
    deleteFast,
    updateFast,
    isHydrated: isFastingStateHydrated,
  } = useFasting()
  const isFastingStateLoading = !isFastingStateHydrated

  const {
    entries,
    targetWeightKg,
    addWeight,
    updateWeight,
    deleteWeight,
    updateTargetWeight,
    isHydrated: isWeightStateHydrated,
  } = useWeight()
  const isWeightStateLoading = !isWeightStateHydrated

  return (
    <main className='mx-auto max-w-xl space-y-6 px-6 py-6'>
      <Header />

      {isFastingStateLoading ? (
        <>
          <FastingTimerSkeleton />
          <FastingPlanCardSkeleton />
        </>
      ) : (
        <>
          <FastingTimer
            planId={planId}
            session={session}
            endFasting={endFasting}
            startFasting={startFasting}
          />
          <FastingPlanCard planId={planId} updatePlanId={updatePlanId} />
        </>
      )}

      <FastingStatistics
        fasts={fasts}
        addFast={addFast}
        deleteFast={deleteFast}
        updateFast={updateFast}
      />

      <TargetWeightCard
        targetWeight={targetWeightKg}
        update={updateTargetWeight}
        isLoading={isWeightStateLoading}
      />
      <WeightStatistics />
    </main>
  )
}
