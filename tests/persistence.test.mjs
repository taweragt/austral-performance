import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const start = source.indexOf("const importedKey=");
const endMarker = "window.syncPendingImports=syncPendingImports;";
const end = source.indexOf(endMarker, start) + endMarker.length;
assert.ok(start >= 0 && end > start, "Bloco de persistência não encontrado no app.js");

function harness(saveWeek, initialValues = {}, activeClient = "ethos", saveMetricValue = async () => {}) {
  const values = new Map(Object.entries(initialValues));
  const localStorage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
    snapshot() { return Object.fromEntries(values); },
  };
  const context = {
    console,
    localStorage,
    client: activeClient,
    selected: "",
    selectedStorageKey(clientId) { return `performance-v2-selected-${clientId}`; },
    weeks: [],
    clients: {
      ethos: { weeks: [{ key: "2026-09-01", meta: { leads: 1 } }] },
      extrajuda: { weeks: [] },
    },
    json(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
      catch { return fallback; }
    },
    window: { performanceDb: { ready: true, saveWeek, saveMetricValue } },
  };
  context.window.window = context.window;
  vm.createContext(context);
  vm.runInContext(`${source.slice(start, end)}\nthis.api={imported,queueImported,removeImported,cacheWeek,pendingMetricEdits,queueMetricEdit,loadWeeks,syncPendingImports};`, context);
  return context;
}

const offline = harness(async () => { throw new Error("offline"); });
const offlineWeek = { key: "2026-09-08", meta: { leads: 12 } };
offline.api.queueImported(offlineWeek, "ethos");
offline.api.loadWeeks();
assert.equal(offline.weeks.length, 2, "loadWeeks deve combinar banco e fila local mesmo com performanceDb pronto");
assert.equal(offline.weeks.at(-1).meta.leads, 12);
const offlineResult = await offline.api.syncPendingImports();
assert.deepEqual({ ...offlineResult }, { synced: 0, pending: 1 });
assert.equal(offline.api.imported("ethos").length, 1, "Falha do banco deve manter a semana local");

const online = harness(async () => {});
const onlineWeek = { key: "2026-09-15", meta: { messages: 47 } };
online.api.queueImported(onlineWeek, "extrajuda");
const onlineResult = await online.api.syncPendingImports();
assert.deepEqual({ ...onlineResult }, { synced: 1, pending: 0 });
assert.equal(online.api.imported("extrajuda").length, 1, "Sucesso do banco deve preservar a cópia local da semana");
assert.equal(online.localStorage.getItem("performance-v2-imported-pending-extrajuda"), "[]", "Sucesso deve limpar somente a fila pendente");
assert.equal(online.clients.extrajuda.weeks[0].meta.messages, 47, "Semana sincronizada deve permanecer na memória atual");

const reloaded = harness(async () => { throw new Error("banco indisponível durante recarga"); }, online.localStorage.snapshot(), "extrajuda");
reloaded.api.loadWeeks();
assert.equal(reloaded.weeks.length, 1, "A cópia sincronizada deve reaparecer depois de uma recarga completa");
assert.equal(reloaded.weeks[0].meta.messages, 47);

const editedWeek = { key: "2026-09-01", meta: { leads: 10, cpl: 20 } };
let savedEdit;
const edited = harness(async () => {}, {}, "ethos", async (...args) => { savedEdit = args; });
edited.api.cacheWeek(editedWeek, "ethos");
edited.api.queueMetricEdit({ weekKey: editedWeek.key, platform: "meta", metricKey: "leads", value: 10 }, "ethos");
assert.equal(edited.api.pendingMetricEdits("ethos").length, 1, "Edição deve entrar na fila local antes do envio");
const editedResult = await edited.api.syncPendingImports();
assert.deepEqual({ ...editedResult }, { synced: 1, pending: 0 });
assert.equal(savedEdit[3], "leads");
assert.equal(savedEdit[4], 10);
assert.equal(edited.api.pendingMetricEdits("ethos").length, 0, "Sucesso deve remover a edição da fila");
edited.api.loadWeeks();
assert.equal(edited.weeks[0].meta.leads, 10, "Valor corrigido deve sobreviver à recarga pelo cache");

const cleared = harness(async () => {}, edited.localStorage.snapshot(), "ethos", async (...args) => { savedEdit = args; });
cleared.api.queueMetricEdit({ weekKey: editedWeek.key, platform: "meta", metricKey: "leads", value: null }, "ethos");
await cleared.api.syncPendingImports();
assert.equal(savedEdit[4], null, "Limpar valor deve enviar uma exclusão explícita ao banco");

const withActions = harness(async () => {}, {
  "performance-v2-imported-ethos": JSON.stringify([{ key: "2026-09-01", meta: { leads: 1 }, actions: [] }]),
  "performance-v2-imported-pending-ethos": "[]",
});
withActions.clients.ethos.weeks[0].actions = [{ id: "a1", title: "Revisar criativos", done: true }];
await withActions.api.syncPendingImports();
withActions.api.loadWeeks();
assert.equal(withActions.weeks[0].actions.length, 1, "Cache local sem ações não pode substituir a semana do banco");
assert.equal(withActions.weeks[0].actions[0].done, true);

const pendingWithActions = harness(async () => {}, {
  "performance-v2-imported-ethos": JSON.stringify([{ key: "2026-09-01", meta: { leads: 5 }, actions: [] }]),
  "performance-v2-imported-pending-ethos": JSON.stringify(["2026-09-01"]),
});
pendingWithActions.clients.ethos.weeks[0].actions = [{ id: "a1", title: "Revisar criativos", done: true }];
await pendingWithActions.api.syncPendingImports();
pendingWithActions.api.loadWeeks();
assert.equal(pendingWithActions.weeks[0].meta.leads, 5, "Importação pendente deve atualizar as métricas");
assert.equal(pendingWithActions.weeks[0].actions.length, 1, "Importação pendente não pode apagar as ações do banco");

console.log("Persistência validada: cache após recarga, retenção offline e edição individual sincronizada.");
