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

export default function Page() {
  const {
    planId,
    session,
    fasts,
    endFasting,
    isHydrated,
    startFasting,
    updatePlanId,
    addFast,
    deleteFast,
    updateFast,
  } = useFasting()
  const isLoading = !isHydrated

  return (
    <main className='mx-auto max-w-xl space-y-6 px-6 py-6'>
      <Header />

      {isLoading ? (
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

      <TargetWeightCard />
      <WeightStatistics />
    </main>
  )
}
