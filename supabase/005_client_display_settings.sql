-- Configuração visual por cliente.
-- Seguro para reexecução.

alter table public.clients
  add column if not exists show_creative boolean not null default true;

comment on column public.clients.show_creative is
  'Define se o bloco Peça associada aparece no painel semanal do cliente.';

update public.clients
set default_meta_metrics = array['messages','costPerMessage','results','costPerResult','followers','newFollowers']
where id in ('extra-ajuda', 'trilha-radical')
  and not (default_meta_metrics @> array['messages']);

update public.metric_strategies
set metric_keys = array['messages','costPerMessage','results','costPerResult','followers','newFollowers']
where client_id in ('extra-ajuda', 'trilha-radical')
  and platform = 'meta'
  and not (metric_keys @> array['messages']);
