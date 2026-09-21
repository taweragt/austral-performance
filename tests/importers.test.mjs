import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const app = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const importerSource = app.slice(app.indexOf("const norm="), app.indexOf("let editingPlatform"));

function run(expression, input) {
  const context = { input };
  vm.runInNewContext(`${importerSource};globalThis.result=${expression}`, context);
  return context.result;
}

const ethosPath = "C:/Users/User/Desktop/01 - AUSTRAL/00 - RELATÓRIOS/14.09/ethos - google.csv";
const ethos = fs.readFileSync(ethosPath, "utf8");
const google = run("googleAggregate(csv(input))", ethos);
assert.equal(google.leads, 40);
assert.equal(google.spend, 835.69);
assert.equal(google.cpl, null);

const meta = `Campanha,Tipo de resultado,Resultados,Valor gasto\nWhatsApp - Extra Ajuda,Conversas por mensagem iniciadas,47,"235,00"\nFormulário institucional,Leads,3,"45,00"`;
const messages = run("metaAggregate(csv(input))", meta);
assert.equal(messages.messages, 47);
assert.equal(messages.leads, 3);
assert.equal(messages.results, 50);
assert.equal(messages.costPerMessage, 5);
assert.equal(messages.costPerResult, 5.6);

console.log(JSON.stringify({ google, messages }, null, 2));
