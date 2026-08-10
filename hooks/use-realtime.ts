'use client'

import { getProfileId } from '@/lib/supabase-db'
import { requestSync } from '@/lib/sync'
import { createClient } from '@/supabase/client'
import { useEffect } from 'react'

/**
 * Subscribes to remote database changes relevant to Trinity's
 * synchronization system.
 *
 * Realtime events are used only as synchronization triggers. When a
 * relevant database change occurs, the synchronization engine is
 * requested to download and apply the latest remote state.
 *
 * This hook does not modify local persistence or React state directly.
 * Those responsibilities remain with the synchronization engine and
 * domain hooks respectively.
 *
 * The hook establishes a single Supabase Realtime channel containing
 * subscriptions for all tables participating in cross-device
 * synchronization.
 */
export const useRealtime = (): void => {
  useEffect(() => {
    const supabase = createClient()

    let channel: ReturnType<typeof supabase.channel> | null = null
    let cancelled = false

    const subscribe = async () => {
      const profileId = await getProfileId(supabase)

      if (cancelled) return

      channel = supabase
        .channel('trinity-sync')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${profileId}`,
          },
          () => {
            void requestSync()
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'fasts',
            filter: `profile_id=eq.${profileId}`,
          },
          () => {
            void requestSync()
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'fasts',
            filter: `profile_id=eq.${profileId}`,
          },
          () => {
            void requestSync()
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'weight_entries',
            filter: `profile_id=eq.${profileId}`,
          },
          () => {
            void requestSync()
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'weight_entries',
            filter: `profile_id=eq.${profileId}`,
          },
          () => {
            void requestSync()
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'fasts_deletions',
            filter: `profile_id=eq.${profileId}`,
          },
          () => {
            void requestSync()
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'weight_entries_deletions',
            filter: `profile_id=eq.${profileId}`,
          },
          () => {
            void requestSync()
          },
        )

      void channel.subscribe()
    }

    void subscribe()

    return () => {
      cancelled = true

      if (channel) {
        void supabase.removeChannel(channel)
      }
    }
  }, [])
}
