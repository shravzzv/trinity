'use client'

import Link from 'next/link'
import { siteLinks } from '@/constants/navigation'
import SettingsPreferencesSection from '@/components/settings-preferences-section'
import SettingsFastingSection from '@/components/settings-fasting-section'
import SettingsWeightSection from '@/components/settings-weight-section'
import SettingsAccountSection from '@/components/settings-account-section'
import SettingsDataSection from '@/components/settings-data-section'
import SettingsDangerZone from '@/components/settings-danger-zone'
import { useAuthContext } from '@/providers/auth-provider'

export default function Page() {
  const { isAuthenticated } = useAuthContext()

  return (
    <div className='mx-auto w-full max-w-xl space-y-6'>
      <SettingsPreferencesSection />
      <SettingsFastingSection />
      <SettingsWeightSection />
      <SettingsAccountSection />
      <SettingsDataSection />

      {isAuthenticated && <SettingsDangerZone />}

      <div className='text-muted-foreground flex flex-wrap items-center justify-between gap-2 px-2'>
        {siteLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className='hover:text-primary text-sm underline underline-offset-2'
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
