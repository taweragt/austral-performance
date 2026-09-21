import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const start = source.indexOf("const localIsoDate=");
const end = source.indexOf("function setupImport", start);
assert.ok(start >= 0 && end > start, "Validador da data do relatório não encontrado no app.js");

const context = {};
vm.createContext(context);
vm.runInContext(`${source.slice(start, end)}\nthis.validateReportDate=validateReportDate;`, context);

assert.equal(context.validateReportDate("2026-09-14", "2026-09-21"), "2026-09-14");
assert.throws(() => context.validateReportDate("", "2026-09-21"), /data válida/);
assert.throws(() => context.validateReportDate("2026-09-22", "2026-09-21"), /futuro/);

console.log("Data única validada: obrigatória, válida e não futura.");
