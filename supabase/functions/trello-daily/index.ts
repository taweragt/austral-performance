// Rotina diária: coloca cada cartão aberto do Trello na coluna certa para o dia de hoje.
// Chamada pelo agendador do Supabase (pg_cron) com o cabeçalho x-cron-secret; não usa login de usuário.
// Só move cartões de tarefas NÃO concluídas; nunca cria, apaga ou arquiva cartão.
// Secrets: TRELLO_KEY, TRELLO_TOKEN, TRELLO_BOARD, TRELLO_ENABLED e CRON_SECRET.
import { createClient } from "npm:@supabase/supabase-js@2";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
const DAY_LIST_PREFIX = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "Método não permitido" }, 405);
  const expected = Deno.env.get("CRON_SECRET")?.trim();
  if (!expected || request.headers.get("x-cron-secret") !== expected) return json({ error: "Não autorizado" }, 401);
  if (Deno.env.get("TRELLO_ENABLED")?.trim() !== "true") return json({ skipped: true, reason: "Envio ao Trello desligado" });

  const key = Deno.env.get("TRELLO_KEY")?.trim(), token = Deno.env.get("TRELLO_TOKEN")?.trim(), board = Deno.env.get("TRELLO_BOARD")?.trim();
  if (!key || !token || !board) return json({ error: "Secrets do Trello incompletos" }, 500);

  const database = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const auth = `key=${encodeURIComponent(key)}&token=${encodeURIComponent(token)}`;
  const trello = async (method: string, path: string, params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`https://api.trello.com/1${path}?${auth}${query ? `&${query}` : ""}`, { method });
    if (!response.ok) throw new Error(`Trello ${response.status} em ${method} ${path}`);
    return response.json();
  };

  try {
    const lists: { id: string; name: string }[] = await trello("GET", `/boards/${board}/lists`, { fields: "name" });
    const listByPrefix = (prefix: string) => lists.find((list) => norm(list.name).startsWith(prefix))?.id;
    const todo = listByPrefix("a fazer"), late = listByPrefix("atrasado");
    if (!todo || !late) return json({ error: "O quadro precisa das listas A fazer e Atrasado" }, 422);
    const dayList = (day: number) => listByPrefix(DAY_LIST_PREFIX[day]);

    const today = Date.parse(`${new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10)}T12:00:00Z`);
    const weekEnd = today - ((new Date(today).getUTCDay() + 6) % 7) * 864e5 + 7 * 864e5;

    const rows = await database.from("actions").select("id, due_date, carried_from, external_id").eq("done", false).not("external_id", "is", null);
    if (rows.error) throw rows.error;

    // Uma única leitura do quadro diz em que lista cada cartão aberto está.
    const cards: { id: string; idList: string }[] = await trello("GET", `/boards/${board}/cards`, { fields: "idList", filter: "open" });
    const current = new Map(cards.map((card) => [card.id, card.idList]));

    let moved = 0;
    const failures: { card: string; error: string }[] = [];
    for (const action of rows.data) {
      const here = current.get(action.external_id);
      if (!here) continue; // cartão arquivado ou apagado no Trello: não mexe
      const dueMs = action.due_date ? Date.parse(`${action.due_date}T12:00:00Z`) : null;
      const target = action.carried_from || (dueMs !== null && dueMs < today) ? late
        : dueMs !== null && dueMs < weekEnd ? (dayList(new Date(dueMs).getUTCDay()) ?? todo)
        : todo;
      if (target === here) continue;
      try {
        await trello("PUT", `/cards/${action.external_id}`, { idList: target });
        moved++;
        await sleep(150);
      } catch (error) {
        console.error("trello-daily cartão falhou:", action.external_id, (error as Error).message);
        failures.push({ card: action.external_id, error: (error as Error).message });
      }
    }
    console.log(`trello-daily: ${rows.data.length} tarefas abertas com cartão, ${moved} movidas, ${failures.length} falhas`);
    return json({ checked: rows.data.length, moved, failures });
  } catch (error) {
    const detail = error instanceof Error ? error.message : JSON.stringify(error);
    console.error("trello-daily falhou:", detail);
    return json({ error: detail }, 502);
  }
});
