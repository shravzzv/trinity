-- Refines profile constraints and RLS policies for consistency.
-- Update the target weight constraint to match the application's
-- supported weight range.
alter table public.profiles
drop constraint profiles_target_weight_kg_check;

alter table public.profiles
add constraint profiles_target_weight_kg_check check (
  target_weight_kg is null
  or target_weight_kg between 2 and 500
);

-- Ensure updated profile rows still belong to the authenticated user.
drop policy "users can update their own profile" on public.profiles;

create policy "users can update their own profile" on public.profiles for
update using (auth.uid () = id)
with
  check (auth.uid () = id);
