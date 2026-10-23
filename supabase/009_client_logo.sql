-- Logo opcional do cliente, guardada no bucket privado em logos/<cliente>.<ext>.
-- Qualquer membro pode ler; só o proprietário grava, troca ou apaga.
alter table public.clients add column if not exists logo_path text;

do $$
declare
  op text;
begin
  foreach op in array array['insert', 'update', 'delete'] loop
    if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'owner_only_' || op || '_logos') then
      if op = 'insert' then
        create policy owner_only_insert_logos on storage.objects as restrictive for insert to authenticated
          with check (bucket_id <> 'performance-creatives' or name not like 'logos/%' or public.is_workspace_owner());
      elsif op = 'update' then
        create policy owner_only_update_logos on storage.objects as restrictive for update to authenticated
          using (bucket_id <> 'performance-creatives' or name not like 'logos/%' or public.is_workspace_owner())
          with check (bucket_id <> 'performance-creatives' or name not like 'logos/%' or public.is_workspace_owner());
      else
        create policy owner_only_delete_logos on storage.objects as restrictive for delete to authenticated
          using (bucket_id <> 'performance-creatives' or name not like 'logos/%' or public.is_workspace_owner());
      end if;
    end if;
  end loop;
end $$;
