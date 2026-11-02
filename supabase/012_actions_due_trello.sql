-- Tarefas: prazo, origem (semana de onde foi trazida) e vínculo com o cartão do Trello.
-- Só adiciona colunas vazias; nada do que existe é alterado. Reversível com os "drop column" no fim.
alter table public.actions add column if not exists due_date date;
alter table public.actions add column if not exists carried_from date;
alter table public.actions add column if not exists external_id text;
alter table public.actions add column if not exists external_url text;

-- Reversão (não executar a não ser que queira desfazer):
-- alter table public.actions drop column if exists external_url;
-- alter table public.actions drop column if exists external_id;
-- alter table public.actions drop column if exists carried_from;
-- alter table public.actions drop column if exists due_date;
