-- Stores tombstones for deleted fasts.
--
-- Tombstones allow deletions to be synchronized across devices.
-- Rather than immediately forgetting a deleted fast, Trinity records
-- the deletion here so that other devices can remove their local copy
-- during the next synchronization.
create table
  public.fasts_deletions (
    -- Primary key.
    id uuid primary key,
    -- Owner of this deletion.
    profile_id uuid not null references public.profiles (id) on delete cascade,
    -- Identifier of the deleted fast.
    entity_id uuid not null,
    -- When the fast was deleted on the originating device.
    deleted_at timestamptz not null,
    -- Metadata.
    created_at timestamptz not null default now(),
    -- Prevent duplicate tombstones for the same deleted fast.
    -- Constraint applies on the pair.
    unique (profile_id, entity_id)
  );

-- Dashboard comments.
comment on table public.fasts_deletions is 'Synchronization tombstones for deleted fasts.';

comment on column public.fasts_deletions.id is 'Primary key.';

comment on column public.fasts_deletions.profile_id is 'Owner of this deletion.';

comment on column public.fasts_deletions.entity_id is 'Identifier of the deleted fast.';

comment on column public.fasts_deletions.deleted_at is 'When the fast was deleted on the originating device.';

comment on column public.fasts_deletions.created_at is 'When this tombstone was created.';

-- Indexes.
create index fasts_deletions_profile_id_idx on public.fasts_deletions (profile_id);

create index fasts_deletions_deleted_at_idx on public.fasts_deletions (deleted_at);

alter table public.fasts_deletions enable row level security;

create policy "users can view their own deleted fasts" on public.fasts_deletions for
select
  using (profile_id = auth.uid ());

create policy "users can create their own deleted fasts" on public.fasts_deletions for insert
with
  check (profile_id = auth.uid ());

create policy "users can delete their own deleted fasts" on public.fasts_deletions for delete using (profile_id = auth.uid ());
