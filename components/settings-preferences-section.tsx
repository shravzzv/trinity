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
        <CardContent className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <p className='text-base font-medium'>Theme</p>
            <ThemeToggle />
          </div>

          {isAuthenticated && (
            <>
              <Separator />

              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-base font-medium'>Notifications</p>
                  <p className='text-muted-foreground text-xs'>
                    Notifications may not be available on all devices.
                  </p>
                </div>
                <Switch disabled={!isOnline} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
