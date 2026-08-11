'use client'

import { useAuthContext } from '@/providers/auth-provider'
import SettingsAccountAuthCard from './settings-account-auth-card'
import SettingsAccountEmailPasswordCard from './settings-account-email-password-card'
import SettingsAccountLinkingCard from './settings-account-linking-card'

export default function SettingsAccountSection() {
  const { isAuthenticated } = useAuthContext()

  return (
    <section className='space-y-6'>
      <h2 className='font-semibold'>Account</h2>
      <SettingsAccountAuthCard />

      {isAuthenticated && (
        <>
          <SettingsAccountEmailPasswordCard />
          <SettingsAccountLinkingCard />
        </>
      )}
    </section>
  )
}
