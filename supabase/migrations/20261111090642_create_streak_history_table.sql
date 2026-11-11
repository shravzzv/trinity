-- Stores individual fasting outcomes used to calculate streaks
-- and derive the streak calendar.
create table
  public.streak_history (
    -- Primary key.
    id uuid primary key,
    -- Owner of this history entry.
    profile_id uuid not null references public.profiles (id) on delete cascade,
    -- Timestamp when the fasting session ended.
    date timestamptz not null,
    -- Outcome of the fasting session.
    status text not null,
    -- Metadata.
    created_at timestamptz not null default now(),
    -- Status can only be one of the defined values.
    constraint streak_history_status_check check (status in ('completed', 'missed', 'anchored'))
  );

-- Dashboard comments.
comment on table public.streak_history is 'Records individual fasting outcomes used to calculate streaks and derive the streak calendar.';

comment on column public.streak_history.id is 'Primary key. Unique identifier for this streak history entry.';

comment on column public.streak_history.profile_id is 'Owner of this streak history entry. References profiles.id.';

comment on column public.streak_history.date is 'Timestamp when the fasting session ended. Used to establish chronological order and derive the calendar date.';

comment on column public.streak_history.status is 'Outcome of the fasting session: completed, missed, or anchored.';

comment on column public.streak_history.created_at is 'When this streak history entry was created.';

-- Indexes.
-- Supports retrieving a profile's streak history in chronological order.
create index streak_history_profile_id_date_idx on public.streak_history (profile_id, date);

-- Row-level security.
alter table public.streak_history enable row level security;

create policy "users can view their own streak history" on public.streak_history for
select
  to authenticated using (profile_id = auth.uid ());

create policy "users can create their own streak history" on public.streak_history for insert to authenticated
with
  check (profile_id = auth.uid ());

create policy "users can delete their own streak history" on public.streak_history for delete to authenticated using (profile_id = auth.uid ());
