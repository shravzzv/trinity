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
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from '@/types/database'
import type { Fast, FastingPlanId } from '@/types/fasting'
import type { StreakStatus } from '@/types/gamification'
import type { WeightEntry } from '@/types/weight'
import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Returns the authenticated user's profile.
 *
 * @returns The user's profile.
 */
export const getProfile = async (): Promise<Tables<'profiles'>> => {
  const supabase = createClient()

  const { data, error } = await supabase.from('profiles').select().single()

  if (error) {
    throw Error('Fetching profile failed', {
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
export const updateProfile = async (profile: TablesUpdate<'profiles'>) => {
  const supabase = createClient()

  const { error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', profile.id)

  if (error) {
    throw Error('Updating profile failed', {
      cause: error,
    })
  }
}

/**
 * Returns all historical fast records.
 *
 * @returns All stored fasts.
 */
export const getFasts = async (): Promise<Fast[]> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('fasts')
    .select()
    .order('ended_at', { ascending: false })

  if (error) {
    throw Error('Fetching fasts failed', {
      cause: error,
    })
  }

  return data.map(toFast)
}

/**
 * Persists a fast.
 *
 * @param fast The fast to insert.
 */
export const addFast = async (fast: Fast) => {
  const supabase = createClient()
  const profileId = await getProfileId(supabase)

  const { error } = await supabase
    .from('fasts')
    .insert(toFastRow(fast, profileId))

  if (error) {
    throw Error('Inserting fast failed', {
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
  const profileId = await getProfileId(supabase)

  const fastRows = fasts.map((fast) => toFastRow(fast, profileId))
  const { error } = await supabase.from('fasts').insert(fastRows)

  if (error) {
    throw Error('Inserting fasts failed', {
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
  const profileId = await getProfileId(supabase)

  const { error } = await supabase
    .from('fasts')
    .update(toFastRow(fast, profileId))
    .eq('id', fast.id)

  if (error) {
    throw Error('Updating fast failed', {
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
    throw Error('Deleting fast failed', {
      cause: error,
    })
  }
}

/**
 * Returns all weight entries.
 *
 * @returns All stored weight entries.
 */
export const getWeightEntries = async (): Promise<WeightEntry[]> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('weight_entries')
    .select()
    .order('recorded_at', { ascending: false })

  if (error) {
    throw Error('Fetching weight entries failed', {
      cause: error,
    })
  }

  return data.map(toWeightEntry)
}

/**
 * Persists a  weight entry.
 *
 * @param weightEntry The weight entry to insert.
 */
export const addWeightEntry = async (weightEntry: WeightEntry) => {
  const supabase = createClient()
  const profileId = await getProfileId(supabase)

  const { error } = await supabase
    .from('weight_entries')
    .insert(toWeightEntryRow(weightEntry, profileId))

  if (error) {
    throw Error('Inserting weight entry failed', {
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
  const profileId = await getProfileId(supabase)

  const weightEntryRows = weightEntries.map((entry) =>
    toWeightEntryRow(entry, profileId),
  )

  const { error } = await supabase
    .from('weight_entries')
    .insert(weightEntryRows)

  if (error) {
    throw Error('Inserting weight entries failed', {
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
  const profileId = await getProfileId(supabase)

  const { error } = await supabase
    .from('weight_entries')
    .update(toWeightEntryRow(weightEntry, profileId))
    .eq('id', weightEntry.id)

  if (error) {
    throw Error('Updating weight entry failed', {
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
    throw Error('Deleting weight entry failed', {
      cause: error,
    })
  }
}

/**
 * Returns the authenticated user's profile identifier.
 *
 * In Trinity, the `profiles.id` primary key is the same as the authenticated
 * user's `auth.users.id`. This helper retrieves that identifier for use when
 * reading from or writing to profile-owned tables.
 *
 * @throws {Error} If there is no authenticated user.
 * @returns The authenticated user's profile identifier.
 */
export const getProfileId = async (
  supabase: SupabaseClient<Database>,
): Promise<string> => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('No authenticated user.')

  return user.id
}

/**
 * Converts a local {@link Fast} into a Supabase fast row.
 *
 * @param fast The local fast.
 * @param profileId The owning profile's identifier.
 * @returns The corresponding database row.
 */
const toFastRow = (fast: Fast, profileId: string): TablesInsert<'fasts'> => {
  return {
    id: fast.id,
    profile_id: profileId,
    started_at: fast.startedAt,
    ended_at: fast.endedAt,
    plan_id: fast.planId,
    streak_status: fast.streakStatus,
  }
}

/**
 * Converts a Supabase fast row into a local {@link Fast}.
 *
 * Downloaded fasts are always synchronized and therefore have
 * {@link Fast.needsSync} set to false.
 *
 * @param row The database row.
 * @returns The corresponding local fast.
 */
const toFast = (row: Tables<'fasts'>): Fast => {
  return {
    id: row.id,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    planId: row.plan_id as FastingPlanId,
    streakStatus: row.streak_status as StreakStatus,
    needsSync: false,
  }
}

/**
 * Converts a local {@link WeightEntry} into a Supabase row.
 *
 * @param weightEntry The local weight entry.
 * @param profileId The owning profile's identifier.
 * @returns The corresponding database row.
 */
const toWeightEntryRow = (
  weightEntry: WeightEntry,
  profileId: string,
): TablesInsert<'weight_entries'> => {
  return {
    id: weightEntry.id,
    profile_id: profileId,
    recorded_at: weightEntry.recordedAt,
    weight_kg: weightEntry.weightKg,
  }
}

/**
 * Converts a Supabase fast row into a local {@link WeightEntry}.
 *
 * Downloaded entries are always synchronized and therefore have
 * {@link WeightEntry.needsSync} set to false.
 *
 * @param row The database row.
 * @returns The corresponding local weight entry.
 */
const toWeightEntry = (row: Tables<'weight_entries'>): WeightEntry => {
  return {
    id: row.id,
    needsSync: false,
    weightKg: row.weight_kg,
    recordedAt: row.recorded_at,
  }
}
