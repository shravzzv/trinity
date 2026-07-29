-- Stores the historical record of body weight measurements for each profile.
create table
  public.weight_entries (
    -- Primary key.
    id uuid primary key,
    -- Owner of this weight entry.
    profile_id uuid not null references public.profiles (id) on delete cascade,
    -- Weight details.
    weight_kg numeric(4, 1) not null,
    recorded_at timestamptz not null,
    -- Metadata.
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint weight_entries_weight_kg_check check (weight_kg between 2 and 500)
  );

comment on table public.weight_entries is 'Stores the historical record of body weight measurements.';

comment on column public.weight_entries.id is 'Primary key.';

comment on column public.weight_entries.profile_id is 'References the profile that owns this weight entry.';

comment on column public.weight_entries.weight_kg is 'Recorded body weight in kilograms.';

comment on column public.weight_entries.recorded_at is 'When the body weight was measured.';

comment on column public.weight_entries.created_at is 'When this weight entry was created.';

comment on column public.weight_entries.updated_at is 'When this weight entry was last modified.';

create index weight_entries_profile_id_index on public.weight_entries (profile_id);

create trigger update_weight_entries_updated_at before
update on public.weight_entries for each row
execute function public.update_updated_at_column ();

alter table public.weight_entries enable row level security;

create policy "users can view their own weight entries" on public.weight_entries for
select
  using (
    exists (
      select
        1
      from
        public.profiles
      where
        profiles.id = weight_entries.profile_id
        and profiles.id = auth.uid ()
    )
  );

create policy "users can insert their own weight entries" on public.weight_entries for insert
with
  check (
    exists (
      select
        1
      from
        public.profiles
      where
        profiles.id = weight_entries.profile_id
        and profiles.id = auth.uid ()
    )
  );

create policy "users can update their own weight entries" on public.weight_entries for
update using (
  exists (
    select
      1
    from
      public.profiles
    where
      profiles.id = weight_entries.profile_id
      and profiles.id = auth.uid ()
  )
)
with
  check (
    exists (
      select
        1
      from
        public.profiles
      where
        profiles.id = weight_entries.profile_id
        and profiles.id = auth.uid ()
    )
  );

create policy "users can delete their own weight entries" on public.weight_entries for delete using (
  exists (
    select
      1
    from
      public.profiles
    where
      profiles.id = weight_entries.profile_id
      and profiles.id = auth.uid ()
  )
);
