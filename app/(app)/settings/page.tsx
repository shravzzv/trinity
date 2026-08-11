'use client'

import Link from 'next/link'
import { motion, type Variants } from 'motion/react'
import { siteLinks } from '@/constants/navigation'
import SettingsPreferencesSection from '@/components/settings-preferences-section'
import SettingsFastingSection from '@/components/settings-fasting-section'
import SettingsWeightSection from '@/components/settings-weight-section'
import SettingsAccountSection from '@/components/settings-account-section'
import SettingsDataSection from '@/components/settings-data-section'
import SettingsDangerZone from '@/components/settings-danger-zone'
import { useAuthContext } from '@/providers/auth-provider'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

export default function Page() {
  const { isAuthenticated } = useAuthContext()

  return (
    <motion.div
      className='mx-auto w-full max-w-xl space-y-6'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <motion.div variants={itemVariants}>
        <SettingsPreferencesSection />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SettingsFastingSection />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SettingsWeightSection />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SettingsAccountSection />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SettingsDataSection />
      </motion.div>

      {isAuthenticated && (
        <motion.div variants={itemVariants}>
          <SettingsDangerZone />
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
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
      </motion.div>
    </motion.div>
  )
}
