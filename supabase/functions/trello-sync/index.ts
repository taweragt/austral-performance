// Envia as tarefas de uma semana para o Trello (um cartão por tarefa).
// Chave e token ficam em secrets do Supabase; nada disso vai para o front-end público.
// Secrets: TRELLO_KEY, TRELLO_TOKEN, TRELLO_BOARD (id curto do quadro), TRELLO_ENABLED ("true" liga, qualquer outro valor desliga).
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
const LIST_NAMES = { todo: "a fazer", late: "atrasado", done: "concluido" } as const;
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DAY_LIST_PREFIX = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
const LABEL_COLORS = ["green", "yellow", "orange", "red", "purple", "blue", "sky", "lime", "pink", "black"];

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (request.method !== "POST") return json({ error: "Método não permitido" }, 405);
  if (Deno.env.get("TRELLO_ENABLED")?.trim() !== "true") return json({ skipped: true, reason: "Envio ao Trello desligado" });

  // trim: espaço ou quebra de linha colados junto com o valor invalidam a chave no Trello.
  const key = Deno.env.get("TRELLO_KEY")?.trim(), token = Deno.env.get("TRELLO_TOKEN")?.trim(), board = Deno.env.get("TRELLO_BOARD")?.trim();
  if (!key || !token || !board) return json({ error: "Secrets do Trello incompletos" }, 500);

  // As leituras usam o login de quem chamou, então as regras de acesso (RLS) continuam valendo.
  const authorization = request.headers.get("Authorization") || "";
  const database = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });
  const user = await database.auth.getUser(authorization.replace(/^Bearer\s+/i, ""));
  if (user.error || !user.data.user) return json({ error: "Não autenticado" }, 401);

  let body: { week_id?: string; archive?: string[] };
  try { body = await request.json(); } catch { return json({ error: "JSON inválido" }, 400); }
  const weekId = body.week_id;
  const archive = (body.archive || []).filter((id) => typeof id === "string" && /^[A-Za-z0-9]{6,40}$/.test(id));
  if (!weekId || !/^[0-9a-f-]{36}$/i.test(weekId)) return json({ error: "week_id inválido" }, 400);

  const auth = `key=${encodeURIComponent(key)}&token=${encodeURIComponent(token)}`;
  const trello = async (method: string, path: string, params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`https://api.trello.com/1${path}?${auth}${query ? `&${query}` : ""}`, { method });
    if (!response.ok) throw Object.assign(new Error(`Trello ${response.status} em ${method} ${path} (chave ${key.length} caracteres, token ${token.length} caracteres)`), { status: response.status });
    return response.json();
  };

  try {
    const week = await database.from("weeks").select("id, client_id, reference_date").eq("id", weekId).single();
    if (week.error) return json({ error: "Semana não encontrada" }, 404);
    const client = await database.from("clients").select("name").eq("id", week.data.client_id).single();
    const clientName = client.data?.name || week.data.client_id;
    const rows = await database.from("actions").select("*").eq("week_id", weekId).order("position");
    if (rows.error) throw rows.error;

    const lists: { id: string; name: string }[] = await trello("GET", `/boards/${board}/lists`, { fields: "name" });
    const listId = (kind: keyof typeof LIST_NAMES) => lists.find((list) => norm(list.name).startsWith(LIST_NAMES[kind]))?.id;
    const todo = listId("todo"), late = listId("late"), done = listId("done");
    if (!todo || !late || !done) return json({ error: "O quadro precisa das listas: A fazer, Atrasado e Concluído" }, 422);

    // Colunas por dia (opcionais): Segunda, Terça... Sem a coluna do dia, o cartão cai em A fazer.
    const dayList = (day: number) => lists.find((list) => norm(list.name).startsWith(DAY_LIST_PREFIX[day]))?.id;
    const today = Date.parse(`${new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10)}T12:00:00Z`);
    const weekEnd = today - ((new Date(today).getUTCDay() + 6) % 7) * 864e5 + 7 * 864e5;

    const labels: { id: string; name: string }[] = await trello("GET", `/boards/${board}/labels`, { fields: "name" });
    let label = labels.find((item) => norm(item.name) === norm(clientName));
    if (!label) {
      const color = LABEL_COLORS[Math.abs([...clientName].reduce((hash, char) => hash * 31 + char.charCodeAt(0), 7)) % LABEL_COLORS.length];
      label = await trello("POST", "/labels", { name: clientName, color, idBoard: (await trello("GET", `/boards/${board}`, { fields: "id" })).id });
    }

    const reference = String(week.data.reference_date).split("-").reverse().join("/");
    const synced: { id: string; external_id: string; external_url: string }[] = [];
    const failures: { id: string; error: string }[] = [];

    for (const action of rows.data) {
      const dueMs = action.due_date ? Date.parse(`${action.due_date}T12:00:00Z`) : null;
      const target = action.done ? done
        : action.carried_from || (dueMs !== null && dueMs < today) ? late
        : dueMs !== null && dueMs < weekEnd ? (dayList(new Date(dueMs).getUTCDay()) ?? todo)
        : todo;
      // Título com o dia da semana e posição por data: a lista já fica na ordem segunda, terça... sem abrir cartão.
      const dueLabel = action.due_date
        ? `${WEEKDAYS[new Date(`${action.due_date}T12:00:00Z`).getUTCDay()]} ${String(action.due_date).split("-").reverse().slice(0, 2).join("/")} · `
        : "";
      const position = action.due_date
        ? Date.parse(`${action.due_date}T12:00:00Z`) / 1000 + (action.position || 0) / 1000
        : 1e10 + (action.position || 0);
      const fields: Record<string, string> = {
        name: `${dueLabel}${clientName} · ${action.title}`,
        pos: String(position),
        desc: `${action.details || ""}\n\nSemana de referência: ${reference}${action.carried_from ? `\nTrazida da semana ${String(action.carried_from).split("-").reverse().join("/")}` : ""}`.trim(),
        idList: target,
        due: action.due_date ? `${action.due_date}T15:00:00.000Z` : "",
        dueComplete: String(Boolean(action.done)),
        closed: "false",
      };
      try {
        let card;
        if (action.external_id) {
          try { card = await trello("PUT", `/cards/${action.external_id}`, fields); }
          catch (error) { if ((error as { status?: number }).status !== 404) throw error; }
        }
        if (!card) card = await trello("POST", "/cards", { ...fields, idLabels: label!.id });
        if (card.id !== action.external_id || card.shortUrl !== action.external_url) {
          const saved = await database.from("actions").update({ external_id: card.id, external_url: card.shortUrl }).eq("id", action.id);
          if (saved.error) throw saved.error;
        }
        synced.push({ id: action.id, external_id: card.id, external_url: card.shortUrl });
      } catch (error) {
        console.error("trello-sync tarefa falhou:", action.id, (error as Error).message);
        failures.push({ id: action.id, error: (error as Error).message });
      }
    }

    // Tarefa excluída no painel: o cartão é arquivado, não apagado.
    for (const cardId of archive) {
      try { await trello("PUT", `/cards/${cardId}`, { closed: "true" }); }
      catch (error) { failures.push({ id: cardId, error: (error as Error).message }); }
    }
    return json({ synced, failures });
  } catch (error) {
    const detail = error instanceof Error ? error.message : JSON.stringify(error);
    console.error("trello-sync falhou:", detail);
    return json({ error: detail }, 502);
  }
});
