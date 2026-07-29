-- Stores the historical record of completed, missed, and anchored fasts for
-- each profile.
create table
  public.fasts (
    -- Primary key.
    id uuid primary key,
    -- Owner of this fast.
    profile_id uuid not null references public.profiles (id) on delete cascade,
    -- Fast details.
    started_at timestamptz not null,
    ended_at timestamptz not null,
    plan_id text not null,
    streak_status text not null,
    -- Metadata.
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fasts_streak_status_check check (
      streak_status in ('completed', 'missed', 'anchored')
    ),
    constraint fasts_time_range_check check (ended_at >= started_at)
  );

comment on table public.fasts is 'Stores the historical record of completed, missed, and anchored fasts.';

comment on column public.fasts.id is 'Primary key.';

comment on column public.fasts.profile_id is 'References the profile that owns this fast.';

comment on column public.fasts.started_at is 'When the fast started.';

comment on column public.fasts.ended_at is 'When the fast ended.';

comment on column public.fasts.plan_id is 'Identifier of the fasting plan used for this fast.';

comment on column public.fasts.streak_status is 'How this fast affected the user''s streak.';

comment on column public.fasts.created_at is 'When the fast record was created.';

comment on column public.fasts.updated_at is 'When the fast record was last modified.';

create index fasts_profile_id_index on public.fasts (profile_id);

create trigger update_fasts_updated_at before
update on public.fasts for each row
execute function public.update_updated_at_column ();

alter table public.fasts enable row level security;

create policy "users can view their own fasts" on public.fasts for
select
  using (
    exists (
      select
        1
      from
        public.profiles
      where
        profiles.id = fasts.profile_id
        and profiles.id = auth.uid ()
    )
  );

create policy "users can insert their own fasts" on public.fasts for insert
with
  check (
    exists (
      select
        1
      from
        public.profiles
      where
        profiles.id = fasts.profile_id
        and profiles.id = auth.uid ()
    )
  );

create policy "users can update their own fasts" on public.fasts for
update using (
  exists (
    select
      1
    from
      public.profiles
    where
      profiles.id = fasts.profile_id
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
        profiles.id = fasts.profile_id
        and profiles.id = auth.uid ()
    )
  );

create policy "users can delete their own fasts" on public.fasts for delete using (
  exists (
    select
      1
    from
      public.profiles
    where
      profiles.id = fasts.profile_id
      and profiles.id = auth.uid ()
  )
);
