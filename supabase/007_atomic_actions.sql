begin;

create or replace function public.replace_week_actions(
  p_week_id uuid,
  p_actions jsonb default '[]'::jsonb
)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  inserted_count integer := 0;
begin
  if not public.is_workspace_member() then
    raise exception 'Usuário não autorizado para este workspace';
  end if;

  if not exists (select 1 from public.weeks where id = p_week_id) then
    raise exception 'Semana não encontrada';
  end if;

  delete from public.actions where week_id = p_week_id;

  insert into public.actions (week_id, title, details, done, position)
  select
    p_week_id,
    trim(item.title),
    coalesce(item.details, ''),
    coalesce(item.done, false),
    coalesce(item.position, ordinality::integer - 1)
  from jsonb_to_recordset(coalesce(p_actions, '[]'::jsonb)) with ordinality
    as item(title text, details text, done boolean, position integer, ordinality bigint)
  where trim(coalesce(item.title, '')) <> ''
  order by coalesce(item.position, ordinality::integer - 1), ordinality;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

revoke all on function public.replace_week_actions(uuid, jsonb) from public;
grant execute on function public.replace_week_actions(uuid, jsonb) to authenticated;

commit;

