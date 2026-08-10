-- Enable Supabase Realtime for Trinity's synchronization tables.
--
-- These tables are included in the supabase_realtime publication so clients
-- can receive database changes through Supabase Realtime. Realtime events
-- are used as synchronization triggers; the synchronization engine remains
-- responsible for downloading and applying the actual changes.
alter publication supabase_realtime
add table public.profiles;

alter publication supabase_realtime
add table public.fasts;

alter publication supabase_realtime
add table public.weight_entries;

alter publication supabase_realtime
add table public.fasts_deletions;

alter publication supabase_realtime
add table public.weight_entries_deletions;
