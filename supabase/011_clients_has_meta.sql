-- Plataformas ativas por cliente: Meta Ads pode ser pausado (Google Ads já usa has_google).
-- Pausar não apaga histórico; apenas deixa de exigir o relatório e esconde o card.
alter table public.clients add column if not exists has_meta boolean not null default true;
