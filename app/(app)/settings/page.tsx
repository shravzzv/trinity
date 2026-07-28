'use client'

import FastingPlanCard from '@/components/fasting-plan-card'
import TargetWeightCard from '@/components/target-weight-card'
import { useFastingContext } from '@/providers/fasting-provider'
import { useWeightContext } from '@/providers/weight-provider'
import { useGamificationContext } from '@/providers/gamification-provider'
import ThemeToggleCard from '@/components/theme-toggle-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpenText, LifeBuoy, LogOut } from 'lucide-react'
import { useAuthContext } from '@/providers/auth-provider'
import { Card, CardContent } from '@/components/ui/card'
import { signOut } from '@/lib/auth'

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
  const { isAuthenticated } = useAuthContext()

  return (
    <div className='mx-auto w-full max-w-xl space-y-6'>
      <ThemeToggleCard />

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

      <Card>
        <CardContent className='flex items-center justify-evenly'>
          <Button asChild>
            <Link href='/docs'>
              <BookOpenText />
              Docs
            </Link>
          </Button>

          <Button asChild>
            <Link href='/support'>
              <LifeBuoy />
              Support
            </Link>
          </Button>

          {isAuthenticated && (
            <Button onClick={() => signOut('local')}>
              <LogOut />
              Sign out
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
