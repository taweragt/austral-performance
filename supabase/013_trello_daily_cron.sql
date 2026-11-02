-- Rotina diária do Trello (APLICADA no Supabase em 2026-11-02).
-- O valor real de CRON_SECRET NÃO fica neste arquivo (repositório público): guardado só no secret
-- CRON_SECRET do Supabase e no comando do job. Para recriar, troque <CRON_SECRET> pelo valor do secret.
create extension if not exists pg_net;
create extension if not exists pg_cron;

-- Todo dia às 06:00 (Brasília) = 09:00 UTC.
select cron.unschedule(jobid) from cron.job where jobname = 'trello-daily';
select cron.schedule(
  'trello-daily',
  '0 9 * * *',
  $job$
  select net.http_post(
    url := 'https://fcqkdvuqpabuvwfmigzv.supabase.co/functions/v1/trello-daily',
    headers := '{"Content-Type": "application/json", "x-cron-secret": "<CRON_SECRET>"}'::jsonb,
    body := '{}'::jsonb
  );
  $job$
);

-- Desligar a rotina: select cron.unschedule('trello-daily');
