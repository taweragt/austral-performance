-- Convites e gestão segura de acessos ao painel.

create table if not exists public.workspace_invitations (
  email text primary key,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  invited_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

alter table public.workspace_invitations enable row level security;

create or replace function public.is_workspace_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.workspace_members where user_id = auth.uid() and role = 'owner');
$$;
revoke all on function public.is_workspace_owner() from public;
grant execute on function public.is_workspace_owner() to authenticated;

drop policy if exists owners_manage_invitations on public.workspace_invitations;
create policy owners_manage_invitations on public.workspace_invitations
  for all to authenticated using (public.is_workspace_owner()) with check (public.is_workspace_owner());

drop policy if exists owners_read_memberships on public.workspace_members;
create policy owners_read_memberships on public.workspace_members
  for select to authenticated using (public.is_workspace_owner());

create or replace function public.invite_workspace_member(target_email text)
returns void language plpgsql security definer set search_path = public, auth as $$
declare normalized_email text; existing_user auth.users%rowtype;
begin
  if not public.is_workspace_owner() then raise exception 'not_authorized'; end if;
  normalized_email := lower(trim(target_email));
  if normalized_email !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then raise exception 'invalid_email'; end if;
  insert into public.workspace_invitations(email,status,invited_by,created_at,accepted_at)
  values(normalized_email,'pending',auth.uid(),now(),null)
  on conflict(email) do update set status='pending',invited_by=auth.uid(),created_at=now(),accepted_at=null;
  select * into existing_user from auth.users where lower(email)=normalized_email limit 1;
  if found then
    insert into public.workspace_members(user_id,email,role) values(existing_user.id,normalized_email,'member')
    on conflict(user_id) do update set email=excluded.email;
    update public.workspace_invitations set status='accepted',accepted_at=now() where email=normalized_email;
  end if;
end; $$;
revoke all on function public.invite_workspace_member(text) from public;
grant execute on function public.invite_workspace_member(text) to authenticated;

create or replace function public.revoke_workspace_member(target_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare target_email text;
begin
  if not public.is_workspace_owner() then raise exception 'not_authorized'; end if;
  if target_user_id = auth.uid() then raise exception 'cannot_revoke_self'; end if;
  select email into target_email from public.workspace_members where user_id=target_user_id;
  delete from public.workspace_members where user_id=target_user_id and role <> 'owner';
  update public.workspace_invitations set status='revoked' where email=lower(target_email);
end; $$;
revoke all on function public.revoke_workspace_member(uuid) from public;
grant execute on function public.revoke_workspace_member(uuid) to authenticated;

create or replace function public.bootstrap_first_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists(select 1 from public.workspace_members) then
    insert into public.workspace_members(user_id,email,role) values(new.id,new.email,'owner') on conflict(user_id) do nothing;
  elsif exists(select 1 from public.workspace_invitations where email=lower(new.email) and status='pending') then
    insert into public.workspace_members(user_id,email,role) values(new.id,lower(new.email),'member') on conflict(user_id) do update set email=excluded.email;
    update public.workspace_invitations set status='accepted',accepted_at=now() where email=lower(new.email);
  end if;
  return new;
end; $$;
revoke all on function public.bootstrap_first_owner() from public;

