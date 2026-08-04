-- Stores tombstones for deleted weight entries.
--
-- Tombstones allow deletions to be synchronized across devices.
-- Rather than immediately forgetting a deleted weight entry, Trinity
-- records the deletion here so that other devices can remove their
-- local copy during the next synchronization.
create table
  public.weight_entries_deletions (
    -- Primary key.
    id uuid primary key,
    -- Owner of this deletion.
    profile_id uuid not null references public.profiles (id) on delete cascade,
    -- Identifier of the deleted weight entry.
    entity_id uuid not null,
    -- When the weight entry was deleted on the originating device.
    deleted_at timestamptz not null,
    -- Metadata.
    created_at timestamptz not null default now(),
    -- Prevent duplicate tombstones for the same deleted weight entry.
    unique (profile_id, entity_id)
  );

-- Dashboard comments.
comment on table public.weight_entries_deletions is 'Synchronization tombstones for deleted weight entries.';

comment on column public.weight_entries_deletions.id is 'Primary key.';

comment on column public.weight_entries_deletions.profile_id is 'Owner of this deletion.';

comment on column public.weight_entries_deletions.entity_id is 'Identifier of the deleted weight entry.';

comment on column public.weight_entries_deletions.deleted_at is 'When the weight entry was deleted on the originating device.';

comment on column public.weight_entries_deletions.created_at is 'When this tombstone was created.';

-- Indexes.
create index weight_entries_deletions_profile_id_idx on public.weight_entries_deletions (profile_id);

create index weight_entries_deletions_deleted_at_idx on public.weight_entries_deletions (deleted_at);

alter table public.weight_entries_deletions enable row level security;

create policy "users can view their own deleted weight entries" on public.weight_entries_deletions for
select
  using (profile_id = auth.uid ());

create policy "users can create their own deleted weight entries" on public.weight_entries_deletions for insert
with
  check (profile_id = auth.uid ());

create policy "users can delete their own deleted weight entries" on public.weight_entries_deletions for delete using (profile_id = auth.uid ());
