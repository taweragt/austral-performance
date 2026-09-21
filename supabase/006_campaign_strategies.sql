-- Taiom Performance — estratégias de campanha por cliente
-- Seguro para reexecução: cria apenas o que ainda não existe.

create table if not exists public.campaign_strategies (
  id uuid primary key default gen_random_uuid(),
  client_id text not null references public.clients(id) on delete cascade,
  doc_link text,
  raw_text text not null default '',
  campaigns jsonb not null default '[]'::jsonb,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists campaign_strategies_client_idx
  on public.campaign_strategies (client_id, created_at desc);

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_updated_at_campaign_strategies'
  ) then
    create trigger set_updated_at_campaign_strategies
      before update on public.campaign_strategies
      for each row execute function public.set_updated_at();
  end if;
end;
$$;

alter table public.campaign_strategies enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'campaign_strategies'
      and policyname = 'workspace_members_all'
  ) then
    create policy workspace_members_all
      on public.campaign_strategies
      for all
      to authenticated
      using (public.is_workspace_member())
      with check (public.is_workspace_member());
  end if;
end;
$$;

comment on table public.campaign_strategies is 'Estratégias de campanha enviadas por cliente (histórico), com texto bruto colado e a estrutura interpretada (LP, canal, orçamento, público, criativos, palavras-chave e anúncios).';
