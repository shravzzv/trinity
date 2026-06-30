'use client'

import FastingPlanCard from '@/components/fasting-plan-card'
import FastingStatistics from '@/components/fasting-statistics'
import FastingTimer from '@/components/fasting-timer'
import Header from '@/components/header'
import TargetWeightCard from '@/components/target-weight-card'
import { Button } from '@/components/ui/button'
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
    isLoading: isFastingStateLoading,
  } = useFasting()

  const {
    entries,
    targetWeightKg,
    addWeight,
    updateWeight,
    deleteWeight,
    updateTargetWeight,
    isLoading: isWeightStateLoading,
  } = useWeight()

  return (
    <main className='mx-auto max-w-xl space-y-6 px-6 py-6'>
      <Header />

      <FastingTimer
        planId={planId}
        session={session}
        endFasting={endFasting}
        startFasting={startFasting}
        updatePlanId={updatePlanId}
        isLoading={isFastingStateLoading}
      />

      <FastingPlanCard
        planId={planId}
        updatePlanId={updatePlanId}
        isLoading={isFastingStateLoading}
      />

      <FastingStatistics
        fasts={fasts}
        addFast={addFast}
        deleteFast={deleteFast}
        updateFast={updateFast}
        isLoading={isFastingStateLoading}
      />

      <TargetWeightCard
        targetWeight={targetWeightKg}
        update={updateTargetWeight}
        isLoading={isWeightStateLoading}
      />

      <WeightStatistics
        entries={entries}
        addWeight={addWeight}
        updateWeight={updateWeight}
        deleteWeight={deleteWeight}
        targetWeight={targetWeightKg}
        isLoading={isWeightStateLoading}
      />

      <Button
        onClick={() => {
          localStorage.clear()
          location.reload()
        }}
      >
        Clear storage
      </Button>
    </main>
  )
}
