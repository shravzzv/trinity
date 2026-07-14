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
import { useGamification } from '@/hooks/use-gamification'
import CelebrationDialog from '@/components/celebration-dialog'

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
    startAnchoredSession,
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

  const {
    xp,
    streak,
    anchors,
    awardXp,
    awardAnchor,
    spendAnchor,
    resetStreak,
    incrementStreak,
    currentAchievement,
    dismissAchievement,
    isLoading: isGamificationLoading,
  } = useGamification()

  return (
    <main className='mx-auto max-w-xl space-y-6 px-6 py-6'>
      <CelebrationDialog
        open={currentAchievement !== null}
        title={currentAchievement?.title ?? ''}
        description={currentAchievement?.description ?? ''}
        onOpenChange={(open) => {
          if (!open) dismissAchievement()
        }}
      />

      <Header />

      <ProgressCard
        xp={xp}
        fasts={fasts}
        streak={streak}
        anchors={anchors}
        isLoading={isGamificationLoading}
      />

      <FastingTimer
        fasts={fasts}
        planId={planId}
        streak={streak}
        anchors={anchors}
        session={session}
        awardXp={awardXp}
        endFasting={endFasting}
        resetStreak={resetStreak}
        awardAnchor={awardAnchor}
        spendAnchor={spendAnchor}
        startFasting={startFasting}
        updatePlanId={updatePlanId}
        incrementStreak={incrementStreak}
        isLoading={isFastingStateLoading}
        startAnchoredSession={startAnchoredSession}
        updateSessionStartedAt={updateSessionStartedAt}
        preferredFastStartTime={preferredFastStartTime}
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

      <WeightStatistics
        entries={entries}
        awardXp={awardXp}
        addWeight={addWeightEntry}
        targetWeight={targetWeightKg}
        updateWeight={updateWeightEntry}
        deleteWeight={deleteWeightEntry}
        isLoading={isWeightStateLoading}
      />

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
    </main>
  )
}
