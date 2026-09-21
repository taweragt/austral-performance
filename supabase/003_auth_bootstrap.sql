-- Autoriza automaticamente somente o primeiro usuário criado no Auth.
-- Esse primeiro usuário se torna proprietário do workspace.

create or replace function public.bootstrap_first_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.workspace_members (user_id, email, role)
  select new.id, new.email, 'owner'
  where not exists (select 1 from public.workspace_members)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke all on function public.bootstrap_first_owner() from public;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created_bootstrap_owner'
  ) then
    create trigger on_auth_user_created_bootstrap_owner
      after insert on auth.users
      for each row execute function public.bootstrap_first_owner();
  end if;
end;
$$;
