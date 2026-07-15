'use client'

import FastingStatistics from '@/components/fasting-statistics'
import FastingTimer from '@/components/fasting-timer'
import WeightStatistics from '@/components/weight-statistics'
import ProgressCard from '@/components/progress-card'
import CelebrationDialog from '@/components/celebration-dialog'
import { useFastingContext } from '@/providers/fasting-provider'
import { useWeightContext } from '@/providers/weight-provider'
import { useGamificationContext } from '@/providers/gamification-provider'

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
    isLoading: isFastingStateLoading,
  } = useFastingContext()

  const {
    entries,
    targetWeightKg,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    isLoading: isWeightStateLoading,
  } = useWeightContext()

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
  } = useGamificationContext()

  return (
    <div className='mx-auto max-w-6xl space-y-6'>
      <CelebrationDialog
        achievement={currentAchievement}
        onDismiss={dismissAchievement}
      />

      <div className='mx-auto max-w-xl space-y-6'>
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
      </div>

      <div className='mx-auto grid max-w-xl gap-6 lg:max-w-6xl lg:grid-cols-2'>
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
      </div>
    </div>
  )
}
