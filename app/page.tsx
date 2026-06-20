'use client'

import FastingPlanCard from '@/components/fasting-plan-card'
import FastingTimer from '@/components/fasting-timer'
import Header from '@/components/header'
import FastingPlanCardSkeleton from '@/components/skeletons/fasting-plan-card-skeleton'
import FastingTimerSkeleton from '@/components/skeletons/fasting-timer-skeleton'
import { useFasting } from '@/hooks/use-fasting'

export default function Home() {
  const {
    planId,
    session,
    endFasting,
    isHydrated,
    startFasting,
    updatePlanId,
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
    </main>
  )
}
