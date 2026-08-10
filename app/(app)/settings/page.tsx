'use client'

import FastingPlanCard from '@/components/fasting-plan-card'
import TargetWeightCard from '@/components/target-weight-card'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ThemeToggle } from '@/components/theme-toggle'
import { Separator } from '@/components/ui/separator'
import { siteLinks } from '@/constants/navigation'

export default function Page() {
  return (
    <div className='mx-auto w-full max-w-xl space-y-6'>
      <h2 className='font-semibold'>Preferences</h2>
      <Card>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <p className='text-base font-medium'>Theme</p>
            <ThemeToggle />
          </div>

          <Separator />

          <div className='flex items-center justify-between'>
            <p className='text-base font-medium'>Notifications</p>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <h2 className='font-semibold'>Fasting</h2>
      <FastingPlanCard />

      <h2 className='font-semibold'>Weight</h2>
      <TargetWeightCard />

      <h2 className='font-semibold'>Account</h2>
      <h2 className='font-semibold'>Data</h2>

      <h2 className='font-semibold'>Trinity</h2>
      <div className='text-muted-foreground flex flex-wrap items-center justify-between gap-2'>
        {siteLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className='text-sm underline underline-offset-2'
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
