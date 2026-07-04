'use client'

import FastingPlanCard from '@/components/fasting-plan-card'
import FastingStatistics from '@/components/fasting-statistics'
import FastingTimer from '@/components/fasting-timer'
import Header from '@/components/header'
import TargetWeightCard from '@/components/target-weight-card'
import WeightStatistics from '@/components/weight-statistics'
import { useFasting } from '@/hooks/use-fasting'
import { useWeight } from '@/hooks/use-weight'
import ProgressCard from '@/components/progress-card'

export default function Page() {
  const {
    fasts,
    planId,
    addFast,
    session,
    deleteFast,
    updateFast,
    endFasting,
    startFasting,
    updatePlanId,
    preferredFastStartTime,
    updateSessionStartedAt,
    clearPreferredFastStartTime,
    updatePreferredFastStartTime,
    isLoading: isFastingStateLoading,
  } = useFasting()

  const {
    entries,
    targetWeightKg,
    addWeightEntry,
    clearTargetWeight,
    updateWeightEntry,
    deleteWeightEntry,
    updateTargetWeight,
    isLoading: isWeightStateLoading,
  } = useWeight()

  return (
    <main className='mx-auto max-w-xl space-y-6 px-6 py-6'>
      <Header />
      <ProgressCard />

      <FastingTimer
        fasts={fasts}
        planId={planId}
        session={session}
        endFasting={endFasting}
        startFasting={startFasting}
        updatePlanId={updatePlanId}
        isLoading={isFastingStateLoading}
        updateSessionStartedAt={updateSessionStartedAt}
        preferredFastStartTime={preferredFastStartTime}
      />

      <FastingPlanCard
        planId={planId}
        updatePlanId={updatePlanId}
        isLoading={isFastingStateLoading}
        preferredFastStartTime={preferredFastStartTime}
        clearPreferredFastStartTime={clearPreferredFastStartTime}
        updatePreferredFastStartTime={updatePreferredFastStartTime}
      />

      <FastingStatistics
        fasts={fasts}
        planId={planId}
        addFast={addFast}
        updateFast={updateFast}
        deleteFast={deleteFast}
        isLoading={isFastingStateLoading}
        preferredFastStartTime={preferredFastStartTime}
      />

      <TargetWeightCard
        clear={clearTargetWeight}
        update={updateTargetWeight}
        targetWeight={targetWeightKg}
        isLoading={isWeightStateLoading}
      />

      <WeightStatistics
        entries={entries}
        addWeight={addWeightEntry}
        targetWeight={targetWeightKg}
        updateWeight={updateWeightEntry}
        deleteWeight={deleteWeightEntry}
        isLoading={isWeightStateLoading}
      />
    </main>
  )
}
