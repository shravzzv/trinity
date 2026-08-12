'use client'

import { useAuthContext } from '@/providers/auth-provider'
import { ThemeToggle } from './theme-toggle'
import { Card, CardContent } from './ui/card'
import { Separator } from './ui/separator'
import { Switch } from './ui/switch'
import { useNetworkContext } from '@/providers/network-provider'

export default function SettingsPreferencesSection() {
  const { isAuthenticated } = useAuthContext()
  const { isOnline } = useNetworkContext()

  return (
    <section className='space-y-6'>
      <h2 className='font-semibold'>Preferences</h2>

      <Card>
        <CardContent>
          <div className='flex items-center justify-between'>
            <p className='text-base font-medium'>Theme</p>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
