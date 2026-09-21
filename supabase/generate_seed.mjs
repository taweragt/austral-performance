import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../../web-preview-v2/app.js", import.meta.url), "utf8");
const bootstrap = `${source.split("\n").slice(0, 58).join("\n")}\nglobalThis.__clients = clients;`;
const context = { console };
vm.createContext(context);
vm.runInContext(bootstrap, context);

const clients = context.__clients;
const quote = (value) => `'${String(value ?? "").replaceAll("'", "''")}'`;
const nullableNumber = (value) => Number.isFinite(value) ? String(value) : "null";
const sqlArray = (values) => `array[${values.map(quote).join(",")}]::text[]`;

const clientRows = [];
const weekRows = [];
const metricRows = [];
const actionRows = [];

Object.entries(clients).forEach(([clientId, client], clientIndex) => {
  clientRows.push(`(${[
    quote(clientId),
    quote(client.name),
    quote(client.initials),
    nullableNumber(client.metaBudget),
    nullableNumber(client.googleBudget),
    Boolean(client.google),
    Boolean(client.followers),
    Boolean(client.youtube),
    sqlArray(client.metaMetrics.map((metric) => metric.key)),
    sqlArray((client.googleMetrics ?? []).map((metric) => metric.key)),
    clientIndex,
  ].join(",")})`);

  client.weeks.forEach((week) => {
    weekRows.push(`(${quote(clientId)},${quote(week.key)},${quote(week.note ?? "")},'historical')`);

    Object.entries(week.meta ?? {}).forEach(([metricKey, value]) => {
      if (Number.isFinite(value)) {
        metricRows.push(`(${quote(clientId)},${quote(week.key)},'meta',${quote(metricKey)},${value})`);
      }
    });

    Object.entries(week.google ?? {}).forEach(([metricKey, value]) => {
      if (Number.isFinite(value)) {
        metricRows.push(`(${quote(clientId)},${quote(week.key)},'google',${quote(metricKey)},${value})`);
      }
    });

    (week.actions ?? []).forEach(([title, details], position) => {
      actionRows.push(`(${quote(clientId)},${quote(week.key)},${quote(title)},${quote(details ?? "")},${position})`);
    });
  });
});

const sql = `-- Taiom Performance — carga inicial do histórico local
begin;

insert into public.clients (
  id, name, initials, meta_budget, google_budget, has_google,
  tracks_followers, tracks_youtube, default_meta_metrics,
  default_google_metrics, sort_order
)
values
${clientRows.join(",\n")}
on conflict (id) do update set
  name = excluded.name,
  initials = excluded.initials,
  meta_budget = excluded.meta_budget,
  google_budget = excluded.google_budget,
  has_google = excluded.has_google,
  tracks_followers = excluded.tracks_followers,
  tracks_youtube = excluded.tracks_youtube,
  default_meta_metrics = excluded.default_meta_metrics,
  default_google_metrics = excluded.default_google_metrics,
  sort_order = excluded.sort_order;

insert into public.weeks (client_id, reference_date, notes, source)
values
${weekRows.join(",\n")}
on conflict (client_id, reference_date) do update set
  notes = excluded.notes;

insert into public.weekly_metrics (week_id, platform, metric_key, value)
select weeks.id, seed.platform, seed.metric_key, seed.value
from (values
${metricRows.join(",\n")}
) as seed(client_id, reference_date, platform, metric_key, value)
join public.weeks as weeks
  on weeks.client_id = seed.client_id
 and weeks.reference_date = seed.reference_date::date
on conflict (week_id, platform, metric_key) do update set
  value = excluded.value;

${actionRows.length ? `insert into public.actions (week_id, title, details, position)
select weeks.id, seed.title, seed.details, seed.position
from (values
${actionRows.join(",\n")}
) as seed(client_id, reference_date, title, details, position)
join public.weeks as weeks
  on weeks.client_id = seed.client_id
 and weeks.reference_date = seed.reference_date::date
where not exists (
  select 1 from public.actions existing
  where existing.week_id = weeks.id
    and existing.title = seed.title
    and existing.details = seed.details
);` : ""}

commit;

select jsonb_build_object(
  'clients', (select count(*) from public.clients),
  'weeks', (select count(*) from public.weeks),
  'metrics', (select count(*) from public.weekly_metrics),
  'actions', (select count(*) from public.actions)
) as imported;
`;

const outputUrl = new URL("002_seed_history.sql", import.meta.url);
fs.writeFileSync(outputUrl, sql, "utf8");
process.stdout.write(`Gerado: ${outputUrl.pathname}\n${sql.length} caracteres\n`);
