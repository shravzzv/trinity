/**
 * Supabase persistence utilities.
 *
 * Provides low-level CRUD operations for Trinity's Supabase database.
 *
 * This module intentionally contains no synchronization logic.
 * Synchronization is coordinated by `lib/sync.ts`, which uses this
 * module together with `lib/indexed-db.ts`.
 */

import { createClient } from '@/supabase/client'
import type { Tables } from '@/types/database'
import type { Fast } from '@/types/fasting'
import type { WeightEntry } from '@/types/weight'

type Profile = Tables<'profiles'>

/**
 * Returns the authenticated user's profile.
 *
 * @returns The user's profile.
 */
export const getProfile = async () => {
  const supabase = createClient()

  const { data, error } = await supabase.from('profiles').select().single()

  if (error) {
    throw new Error('Fetching profile failed', {
      cause: error,
    })
  }

  return data
}

/**
 * Updates the authenticated user's profile.
 *
 * @param profile The updated profile.
 */
export const updateProfile = async (profile: Profile) => {
  const supabase = createClient()

  const { error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', profile.id)

  if (error) {
    throw new Error('Updating profile failed', {
      cause: error,
    })
  }
}

/**
 * Returns all historical fast records.
 *
 * @returns All stored fasts.
 */
export const getFasts = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('fasts')
    .select()
    .order('ended_at', { ascending: false })

  if (error) {
    throw new Error('Fetching fasts failed', {
      cause: error,
    })
  }

  return data
}

/**
 * Persists a new fast.
 *
 * @param fast The fast to insert.
 */
export const addFast = async (fast: Fast) => {
  const supabase = createClient()

  const { error } = await supabase.from('fasts').insert(fast)

  if (error) {
    throw new Error('Inserting fast failed', {
      cause: error,
    })
  }
}

/**
 * Persists multiple fasts.
 *
 * @param fasts The fasts to insert.
 */
export const addFasts = async (fasts: Fast[]) => {
  const supabase = createClient()

  const { error } = await supabase.from('fasts').insert(fasts)

  if (error) {
    throw new Error('Inserting fasts failed', {
      cause: error,
    })
  }
}

/**
 * Updates an existing fast.
 *
 * @param fast The updated fast.
 */
export const updateFast = async (fast: Fast) => {
  const supabase = createClient()

  const { error } = await supabase.from('fasts').update(fast).eq('id', fast.id)

  if (error) {
    throw new Error('Updating fast failed', {
      cause: error,
    })
  }
}

/**
 * Deletes a fast.
 *
 * @param id The identifier of the fast to delete.
 */
export const deleteFast = async (id: string) => {
  const supabase = createClient()

  const { error } = await supabase.from('fasts').delete().eq('id', id)

  if (error) {
    throw new Error('Deleting fast failed', {
      cause: error,
    })
  }
}

/**
 * Returns all weight entries.
 *
 * @returns All stored weight entries.
 */
export const getWeightEntries = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('weight_entries')
    .select()
    .order('recorded_at', { ascending: false })

  if (error) {
    throw new Error('Fetching weight entries failed', {
      cause: error,
    })
  }

  return data
}

/**
 * Persists a new weight entry.
 *
 * @param weightEntry The weight entry to insert.
 */
export const addWeightEntry = async (weightEntry: WeightEntry) => {
  const supabase = createClient()

  const { error } = await supabase.from('weight_entries').insert(weightEntry)

  if (error) {
    throw new Error('Inserting weight entry failed', {
      cause: error,
    })
  }
}

/**
 * Persists multiple weight entries.
 *
 * @param weightEntries The weight entries to insert.
 */
export const addWeightEntries = async (weightEntries: WeightEntry[]) => {
  const supabase = createClient()

  const { error } = await supabase.from('weight_entries').insert(weightEntries)

  if (error) {
    throw new Error('Inserting weight entries failed', {
      cause: error,
    })
  }
}

/**
 * Updates an existing weight entry.
 *
 * @param weightEntry The updated weight entry.
 */
export const updateWeightEntry = async (weightEntry: WeightEntry) => {
  const supabase = createClient()

  const { error } = await supabase
    .from('weight_entries')
    .update(weightEntry)
    .eq('id', weightEntry.id)

  if (error) {
    throw new Error('Updating weight entry failed', {
      cause: error,
    })
  }
}

/**
 * Deletes a weight entry.
 *
 * @param id The identifier of the weight entry to delete.
 */
export const deleteWeightEntry = async (id: string) => {
  const supabase = createClient()

  const { error } = await supabase.from('weight_entries').delete().eq('id', id)

  if (error) {
    throw new Error('Deleting weight entry failed', {
      cause: error,
    })
  }
}
