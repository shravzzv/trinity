/**
 * Local profile persistence utilities.
 *
 * Provides low-level persistence operations for Trinity's locally stored
 * profile.
 *
 * The profile is stored as a single object in LocalStorage and acts as the
 * application's source of truth for profile-related state, including
 * fasting preferences, weight settings, gamification progress, and
 * synchronization metadata.
 *
 * This module intentionally contains no synchronization logic.
 * Synchronization is coordinated by `lib/sync.ts`, which uses this module
 * together with `lib/supabase-db.ts`.
 */

import { INITIAL_ANCHORS } from '@/constants/gamification'
import { PROFILE_STORAGE_KEY } from '@/constants/storage-keys'
import type { Profile } from '@/types/profile'

const DEFAULT_PROFILE: Profile = {
  fastingPlanId: null,
  fastingSession: null,
  preferredFastStartTime: null,
  targetWeightKg: null,
  xp: 0,
  streak: 0,
  anchors: INITIAL_ANCHORS,
  needsSync: false,
  lastSyncedAt: null,
}

/**
 * Returns the locally persisted profile.
 *
 * If no profile has been persisted yet, or the stored profile is
 * corrupted, a default profile is returned.
 *
 * @returns The current local profile.
 */
export const getProfile = (): Profile => {
  const saved = localStorage.getItem(PROFILE_STORAGE_KEY)

  if (!saved) return DEFAULT_PROFILE

  try {
    return JSON.parse(saved) as Profile
  } catch (error) {
    console.error('Hydrating profile from local storage failed', error)
    localStorage.removeItem(PROFILE_STORAGE_KEY)

    return DEFAULT_PROFILE
  }
}

/**
 * Persists the profile to local storage.
 *
 * @param profile The profile to persist.
 */
export const saveProfile = (profile: Profile): void => {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
}

/**
 * Updates the locally persisted profile.
 *
 * The supplied callback receives the current profile and returns the
 * updated profile to persist.
 *
 * @param updater Produces the updated profile.
 */
export const updateProfile = (updater: (profile: Profile) => Profile): void => {
  const profile = getProfile()
  const updatedProfile = updater(profile)

  saveProfile(updatedProfile)
}
