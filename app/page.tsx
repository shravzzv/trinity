'use client'

import FastingPlanCard from '@/components/fasting-plan-card'
import { ThemeToggle } from '@/components/theme-toggle'
import { FASTING_PLAN_LOCAL_STORAGE_KEY } from '@/constants/storage-keys'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [plan, setPlan] = useState('16:8')
  const [isLoading, setIsLoading] = useState(true)

  const hasHydrated = useRef(false)

  /**
   * Sync selected plan with local storage on change.
   */
  useEffect(() => {
    if (!hasHydrated.current) return
    localStorage.setItem(FASTING_PLAN_LOCAL_STORAGE_KEY, plan)
  }, [plan])

  /**
   * Hydrate plan from local storage if present.
   */
  useEffect(() => {
    const hydrate = () => {
      const existingPlan = localStorage.getItem(FASTING_PLAN_LOCAL_STORAGE_KEY)
      if (existingPlan) setPlan(existingPlan)
      hasHydrated.current = true
      setIsLoading(false)
    }

    hydrate()
  }, [])

  return (
    <main className='mx-auto max-w-xl space-y-6 px-6 py-6'>
      <header className='flex items-center justify-between'>
        <div className='flex flex-1 items-center gap-4'>
          <Image
            src='/icons/icon-512x512.png'
            alt='Trinity'
            width={32}
            height={32}
            className='border-border size-8 rounded-lg border-2'
          />
          <h1 className='text-lg font-semibold'>Trinity</h1>
        </div>

        <div className='shrink-0'>
          <ThemeToggle />
        </div>
      </header>

      <FastingPlanCard plan={plan} setPlan={setPlan} isLoading={isLoading} />
    </main>
  )
}
