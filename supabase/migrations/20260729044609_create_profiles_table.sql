-- Stores the current profile, preferences, and progress for each authenticated
-- user. This table has a one-to-one relationship with auth.users.
create table
  public.profiles (
    -- Primary key. Also references auth.users(id).
    id uuid primary key references auth.users (id) on delete cascade,
    -- User preferences.
    fasting_plan_id text,
    preferred_fast_start_time jsonb,
    -- Current active fasting or eating session.
    fasting_session jsonb,
    -- User goals.
    target_weight_kg numeric(4, 1),
    -- Gamification.
    xp integer not null default 0,
    streak integer not null default 0,
    anchors integer not null default 1,
    -- Synchronization metadata.
    last_synced_at timestamptz,
    -- Metadata.
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint profiles_xp_check check (xp >= 0),
    constraint profiles_streak_check check (streak >= 0),
    constraint profiles_anchors_check check (anchors >= 0),
    constraint profiles_target_weight_kg_check check (
      target_weight_kg is null
      or target_weight_kg > 0
    )
  );

comment on table public.profiles is 'Stores the current profile, preferences, and progress for each authenticated user.';

comment on column public.profiles.id is 'Primary key. Also references auth.users(id).';

comment on column public.profiles.fasting_plan_id is 'The user''s currently selected fasting plan.';

comment on column public.profiles.preferred_fast_start_time is 'Default fasting start time used when creating new fasting sessions.';

comment on column public.profiles.fasting_session is 'The user''s current fasting or eating session.';

comment on column public.profiles.target_weight_kg is 'The user''s target body weight in kilograms.';

comment on column public.profiles.xp is 'The user''s accumulated experience points.';

comment on column public.profiles.streak is 'The user''s current fasting streak.';

comment on column public.profiles.anchors is 'The number of available Anchors.';

comment on column public.profiles.last_synced_at is 'The timestamp of the most recent successful cloud synchronization.';

comment on column public.profiles.created_at is 'When the profile was created.';

comment on column public.profiles.updated_at is 'When the profile was last modified.';

create
or replace function public.update_updated_at_column () returns trigger language plpgsql as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

create trigger update_profiles_updated_at before
update on public.profiles for each row
execute function public.update_updated_at_column ();

alter table public.profiles enable row level security;

create policy "users can view their own profile" on public.profiles for
select
  using (auth.uid () = id);

create policy "users can insert their own profile" on public.profiles for insert
with
  check (auth.uid () = id);

create policy "users can update their own profile" on public.profiles for
update using (auth.uid () = id);
