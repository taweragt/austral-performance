-- Arquivar (reversível) e excluir (definitivo) clientes. Excluir é restrito ao proprietário.
alter table public.clients add column if not exists archived_at timestamptz;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'clients' and policyname = 'owner_only_delete_clients') then
    create policy owner_only_delete_clients on public.clients
      as restrictive for delete to authenticated
      using (public.is_workspace_owner());
  end if;
end $$;
