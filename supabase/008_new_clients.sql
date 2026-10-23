-- Cadastro de novos clientes pelo painel.
-- Cor da marca para clientes sem tema fixo no app.js; criação restrita ao proprietário.

alter table public.clients add column if not exists brand_color text
  check (brand_color is null or brand_color ~ '^#[0-9a-fA-F]{6}$');

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'clients' and policyname = 'owner_only_insert_clients'
  ) then
    create policy owner_only_insert_clients on public.clients
      as restrictive for insert to authenticated
      with check (public.is_workspace_owner());
  end if;
end $$;
