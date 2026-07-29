-- Automatically creates a profile whenever a new authenticated user signs up.
-- This guarantees that every auth.users row has exactly one corresponding
-- profiles row.
drop trigger if exists create_profile_on_signup on auth.users;

drop function if exists public.create_profile_on_signup ();

create
or replace function public.create_profile_on_signup () returns trigger language plpgsql security definer
set
  search_path = public as $$
begin
  insert into public.profiles (id)
  values (new.id);

  return new;
end;
$$;

create trigger create_profile_on_signup
after insert on auth.users for each row
execute function public.create_profile_on_signup ();

comment on function public.create_profile_on_signup () is 'Automatically creates a profile for each newly created authenticated user.';
