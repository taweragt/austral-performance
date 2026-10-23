const $=id=>document.getElementById(id);
const brl=n=>Number.isFinite(n)?n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}):"—";
const num=n=>Number.isFinite(n)?n.toLocaleString("pt-BR"):"—";
const M=(key,label,format="num",extra={})=>({key,label,format,...extra});
const W=(key,meta,google=null,actions=[])=>({key,date:key.split("-").reverse().join("/"),meta,google,actions});
const leads=[M("leads","Leads","num",{big:true}),M("cpl","Custo por lead","brl",{inverse:true}),M("visits","Visualizações da LP"),M("costVisit","Custo por visualização","brl",{inverse:true}),M("followers","Total de seguidores"),M("newFollowers","Novos seguidores","num",{arrow:true})];
const traffic=[M("visits","Visitas / visualizações","num",{big:true}),M("costVisit","Custo por visita","brl",{inverse:true}),M("followers","Total de seguidores"),M("newFollowers","Novos seguidores","num",{arrow:true})];
const google=[M("leads","Leads","num",{big:true}),M("cpl","Custo por lead","brl",{inverse:true}),M("subscribers","Total de inscritos"),M("newSubscribers","Novos inscritos","num",{arrow:true})];
const conversations=[M("messages","Mensagens iniciadas","num",{big:true}),M("costPerMessage","Custo por mensagem","brl",{inverse:true}),M("results","Resultados totais"),M("costPerResult","Custo por resultado","brl",{inverse:true}),M("followers","Total de seguidores"),M("newFollowers","Novos seguidores","num",{arrow:true})];
const oral=[M("leads","Leads totais","num",{big:true}),M("cpl","CPL geral","brl",{inverse:true}),M("webinarLeads","Webinar · leads"),M("webinarCpl","Webinar · CPL","brl",{inverse:true}),M("cadastroLeads","Cadastro · leads"),M("cadastroCpl","Cadastro · CPL","brl",{inverse:true}),M("visits","Visualizações da LP"),M("costVisit","Custo por visualização","brl",{inverse:true}),M("followers","Total de seguidores"),M("newFollowers","Novos seguidores","num",{arrow:true})];
const metaCatalog=[M("results","Resultados totais","num",{big:true}),M("costPerResult","Custo por resultado","brl",{inverse:true}),M("leads","Leads de formulário"),M("cpl","Custo por lead","brl",{inverse:true}),M("messages","Mensagens iniciadas"),M("costPerMessage","Custo por mensagem","brl",{inverse:true}),M("spend","Investimento","brl"),M("visits","Visualizações / visitas"),M("costVisit","Custo por visualização / visita","brl",{inverse:true}),M("profileVisits","Visitas ao perfil"),M("clicks","Cliques"),M("followers","Total de seguidores"),M("newFollowers","Novos seguidores","num",{arrow:true}),M("webinarLeads","Webinar · leads"),M("webinarCpl","Webinar · CPL","brl",{inverse:true}),M("cadastroLeads","Cadastro · leads"),M("cadastroCpl","Cadastro · CPL","brl",{inverse:true})];
const googleCatalog=[M("leads","Leads","num",{big:true}),M("cpl","Custo por lead","brl",{inverse:true}),M("spend","Investimento","brl"),M("subscribers","Total de inscritos"),M("newSubscribers","Novos inscritos","num",{arrow:true})];

const clients={
 "4medic":{name:"4Medic",initials:"4M",metaBudget:2000,googleBudget:4500,google:true,followers:true,youtube:true,metaMetrics:leads,googleMetrics:google,weeks:[]},
 "ethos":{name:"Ethos",initials:"ET",metaBudget:1000,googleBudget:3000,google:true,followers:true,youtube:true,metaMetrics:[M("clicks","Cliques","num",{big:true}),M("profileVisits","Visitas ao perfil"),M("followers","Total de seguidores"),M("newFollowers","Novos seguidores","num",{arrow:true})],googleMetrics:google,weeks:[]},
 "harmonia":{name:"Harmonia",initials:"HA",metaBudget:1000,googleBudget:5000,google:true,followers:true,metaMetrics:traffic,googleMetrics:[M("leads","Leads","num",{big:true}),M("cpl","Custo por lead","brl",{inverse:true})],weeks:[]},
 "muniz":{name:"Muniz Incorporadora",initials:"MI",metaBudget:750,google:false,followers:false,metaMetrics:[M("leads","Leads","num",{big:true}),M("cpl","Custo por lead","brl",{inverse:true})],weeks:[]},
 "rz3":{name:"RZ3",initials:"RZ",metaBudget:900,google:false,followers:true,metaMetrics:traffic,weeks:[]},
 "extra-ajuda":{name:"Extra Ajuda",initials:"EA",metaBudget:1200,google:false,followers:true,metaMetrics:conversations,weeks:[]},
 "trilha-radical":{name:"Trilha Radical",initials:"TR",metaBudget:850,google:false,followers:true,metaMetrics:conversations,weeks:[]},
 "6hm":{name:"6HM",initials:"6H",metaBudget:500,google:false,followers:true,metaMetrics:traffic,weeks:[]},
 "rooah":{name:"Rooah",initials:"RO",metaBudget:500,google:false,followers:true,metaMetrics:leads,weeks:[]},
 "oralwave":{name:"OralWave",initials:"OW",metaBudget:1800,googleBudget:600,google:true,followers:true,metaMetrics:oral,googleMetrics:[M("leads","Leads","num",{big:true}),M("cpl","Custo por lead","brl",{inverse:true})],weeks:[]}
};

const clientThemes={
 "4medic":{logo:"./logo-4medic-square.jpg",logoScale:1,primary:"#2457f5",soft:"#edf2ff",accent:"#12835f",logoBg:"#1715ed"},
 "ethos":{logo:"./assets/logos/ethos.jpg",logoScale:1,logoFit:"contain",primary:"#245b82",soft:"#eaf6f8",accent:"#5bb6ca",logoBg:"#ffffff"},
 "harmonia":{logo:"./assets/logos/harmonia.jpg",logoScale:1.72,primary:"#078ca4",soft:"#e8fafd",accent:"#11b8d1",logoBg:"#ffffff"},
 "muniz":{logo:"./assets/logos/muniz-incorporadora.jpg",logoScale:1.18,primary:"#bf741c",soft:"#fff4e3",accent:"#f4ad45",logoBg:"#ffffff"},
 "rz3":{logo:"./assets/logos/rz3.jpg",logoScale:1.32,primary:"#0b2f63",soft:"#edf3fb",accent:"#d8932d",logoBg:"#ffffff"},
 "extra-ajuda":{logo:"./assets/logos/extra-ajuda.jpg",logoScale:1.34,primary:"#4c46c8",soft:"#efefff",accent:"#252c2c",logoBg:"#ffffff"},
 "trilha-radical":{logo:"./assets/logos/trilha-radical.jpg",logoScale:1,logoFit:"contain",primary:"#667548",soft:"#f3f5ec",accent:"#e88800",logoBg:"#ffffff"},
 "6hm":{logo:"./assets/logos/6hm.jpg",logoScale:1,logoFit:"contain",logoY:"50%",primary:"#151515",darkPrimary:"#b8c2cf",soft:"#f0f0f0",accent:"#5f6875",logoBg:"#000000"},
 "rooah":{logo:"./assets/logos/rooah.jpg",logoScale:1.32,primary:"#202020",darkPrimary:"#f0c414",soft:"#fff7d1",accent:"#d6a500",logoBg:"#000000"},
 "oralwave":{logo:"./assets/logos/oralwave.jpg",logoScale:1.24,primary:"#087f79",soft:"#e7fbf9",accent:"#04b8ad",logoBg:"#04b8ad"}
};

const mixWhite=(hex,amount)=>{const n=parseInt(hex.slice(1),16),mix=shift=>Math.round(((n>>shift)&255)*(1-amount)+255*amount);return"#"+[16,8,0].map(s=>mix(s).toString(16).padStart(2,"0")).join("")};
function themeFor(id,c){
 if(clientThemes[id])return clientThemes[id];
 if(c?.brandColor)return{logo:null,primary:c.brandColor,soft:mixWhite(c.brandColor,.9),accent:c.brandColor,logoBg:c.brandColor,initials:c.initials};
 return clientThemes["4medic"];
}
const brandMark=(theme,c,alt)=>theme.logo?`<img src="${theme.logo}" alt="${alt}">`:`<span class="brand-initials" aria-hidden="true">${esc(c.initials||c.name.slice(0,2).toUpperCase())}</span>`;
const newClientPresets={
 leads:{meta:["leads","cpl","visits","costVisit","followers","newFollowers"],google:["leads","cpl"]},
 traffic:{meta:["visits","costVisit","followers","newFollowers"],google:["leads","cpl"]},
 conversations:{meta:["messages","costPerMessage","results","costPerResult","followers","newFollowers"],google:["leads","cpl"]}
};
const viewStorageKey="performance-v2-view",selectedStorageKey=clientId=>`performance-v2-selected-${clientId}`;
let client=localStorage.getItem("performance-v2-client")||"4medic",selected="",weeks=[],actions=[],appView=localStorage.getItem(viewStorageKey)==="client"?"client":"overview";
if(!clients[client])client="4medic";
selected=localStorage.getItem(selectedStorageKey(client))||"";
const themeStorageKey="performance-v2-theme";
function applyColorMode(mode,save=false){
 const next=mode==="dark"?"dark":"light",button=$("theme-toggle"),dark=next==="dark";
 document.documentElement.dataset.theme=next;
 if(save)localStorage.setItem(themeStorageKey,next);
 if(button){button.setAttribute("aria-pressed",String(dark));button.setAttribute("aria-label",dark?"Ativar modo claro":"Ativar modo escuro");button.title=dark?"Ativar modo claro":"Ativar modo escuro"}
}
const key=kind=>`performance-v2-${kind}-${client}`;
const json=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
function defaultMetrics(platform){const c=clients[client];return platform==="google"?(c.googleMetrics||[]):c.metaMetrics}
function metricCatalogFor(platform){return platform==="google"?googleCatalog:metaCatalog}
function metricVersions(platform){if(window.performanceDb?.ready)return window.performanceDb.metricVersions(client,platform);const value=json(key(`metric-versions-${platform}`),[]);return Array.isArray(value)?value:[]}
function effectiveMetrics(platform,date=selected){
 const defaults=defaultMetrics(platform),versions=metricVersions(platform).filter(v=>v.from<=date).sort((a,b)=>a.from.localeCompare(b.from)),keys=versions.at(-1)?.keys||defaults.map(m=>m.key),catalog=metricCatalogFor(platform);
 return keys.map(metricKey=>defaults.find(m=>m.key===metricKey)||catalog.find(m=>m.key===metricKey)).filter(Boolean);
}
const importedKey=(clientId=client)=>`performance-v2-imported-${clientId}`,pendingImportedKey=(clientId=client)=>`performance-v2-imported-pending-${clientId}`,metricEditKey=(clientId=client)=>`performance-v2-metric-edits-${clientId}`,creativeLinkPendingKey=(clientId=client)=>`performance-v2-creative-links-pending-${clientId}`;
function imported(clientId=client){let x=json(importedKey(clientId),[]);if(clientId==="4medic"&&!x.length)x=json("4medic-v2-imported-weeks",[]);return Array.isArray(x)?x.filter(v=>!v.testOnly):[]}
function storeImported(list,clientId=client){localStorage.setItem(importedKey(clientId),JSON.stringify(list))}
function pendingImported(clientId=client){const raw=localStorage.getItem(pendingImportedKey(clientId));if(raw===null)return imported(clientId).map(item=>item.key);const value=json(pendingImportedKey(clientId),[]);return Array.isArray(value)?[...new Set(value.filter(Boolean))]:[]}
function storePendingImported(keys,clientId=client){localStorage.setItem(pendingImportedKey(clientId),JSON.stringify([...new Set(keys.filter(Boolean))]))}
function queueImported(item,clientId=client){const data=imported(clientId).filter(x=>x.key!==item.key);data.push(item);storeImported(data,clientId);storePendingImported([...pendingImported(clientId),item.key],clientId)}
function markImportedSynced(weekKey,clientId=client){storePendingImported(pendingImported(clientId).filter(key=>key!==weekKey),clientId)}
function removeImported(weekKey,clientId=client){storeImported(imported(clientId).filter(x=>x.key!==weekKey),clientId);markImportedSynced(weekKey,clientId)}
// Atualiza métricas da semana sem descartar o que só existe no banco (ações, nota, peça).
function mergeWeek(list,item){const existing=list.find(x=>x.key===item.key),data=list.filter(x=>x.key!==item.key);data.push(existing?{...existing,...item,actions:existing.actions?.length?existing.actions:(item.actions||[]),note:existing.note||item.note||"",creative:existing.creative??item.creative??null}:item);return data}
function cacheWeek(item,clientId=client){storeImported(mergeWeek(imported(clientId),item),clientId);if(localStorage.getItem(pendingImportedKey(clientId))===null)storePendingImported([],clientId)}
function pendingMetricEdits(clientId=client){const value=json(metricEditKey(clientId),[]);return Array.isArray(value)?value:[]}
function storeMetricEdits(values,clientId=client){localStorage.setItem(metricEditKey(clientId),JSON.stringify(values))}
function queueMetricEdit(edit,clientId=client){storeMetricEdits([...pendingMetricEdits(clientId).filter(item=>!(item.weekKey===edit.weekKey&&item.platform===edit.platform&&item.metricKey===edit.metricKey)),edit],clientId)}
function removeMetricEdit(edit,clientId=client){storeMetricEdits(pendingMetricEdits(clientId).filter(item=>!(item.weekKey===edit.weekKey&&item.platform===edit.platform&&item.metricKey===edit.metricKey)),clientId)}
function pendingCreativeLinks(clientId=client){const value=json(creativeLinkPendingKey(clientId),[]);return Array.isArray(value)?value:[]}
function storePendingCreativeLinks(values,clientId=client){localStorage.setItem(creativeLinkPendingKey(clientId),JSON.stringify(values))}
function queueCreativeLink(weekKey,value,clientId=client){storePendingCreativeLinks([...pendingCreativeLinks(clientId).filter(item=>item.weekKey!==weekKey),{weekKey,value}],clientId)}
function removePendingCreativeLink(weekKey,clientId=client){storePendingCreativeLinks(pendingCreativeLinks(clientId).filter(item=>item.weekKey!==weekKey),clientId)}
function pendingCreativeLink(weekKey=selected,clientId=client){return pendingCreativeLinks(clientId).find(item=>item.weekKey===weekKey)?.value}
// Com o banco conectado, a semana do banco prevalece; o cache local só entra para datas que o banco não tem.
function loadWeeks(){const base=clients[client].weeks,cached=imported(),extras=window.performanceDb?.ready?cached.filter(x=>!base.some(w=>w.key===x.key)):cached,now=new Date(),today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;weeks=[...base,...extras].reduce((a,x)=>{const i=a.findIndex(v=>v.key===x.key);i<0?a.push(x):a[i]=x;return a},[]).filter(item=>item.key<=today).sort((a,b)=>a.key.localeCompare(b.key));if(!weeks.some(x=>x.key===selected))selected=weeks.at(-1)?.key||"";if(selected)localStorage.setItem(selectedStorageKey(client),selected);else localStorage.removeItem(selectedStorageKey(client))}
async function syncPendingImports(){
 if(!window.performanceDb?.ready)return{synced:0,pending:0};
 let synced=0,pending=0;
 for(const clientId of Object.keys(clients)){
  // Cache só preenche datas ausentes no banco; semanas pendentes atualizam métricas preservando ações e notas do banco.
  const cached=imported(clientId),pendingKeys=pendingImported(clientId);
  cached.forEach(item=>{const inDb=clients[clientId].weeks.some(week=>week.key===item.key);if(!inDb||pendingKeys.includes(item.key))clients[clientId].weeks=mergeWeek(clients[clientId].weeks,item)});
  for(const weekKey of pendingKeys){
   const item=cached.find(value=>value.key===weekKey);
   if(!item){markImportedSynced(weekKey,clientId);continue}
   try{await window.performanceDb.saveWeek(clientId,item);markImportedSynced(item.key,clientId);synced++}
   catch(error){console.error(`Não foi possível sincronizar ${clientId}/${item.key}:`,error);pending++}
  }
  for(const edit of pendingMetricEdits(clientId)){
   const week=clients[clientId].weeks.find(item=>item.key===edit.weekKey)||cached.find(item=>item.key===edit.weekKey);
   if(!week){removeMetricEdit(edit,clientId);continue}
   try{await window.performanceDb.saveMetricValue(clientId,week,edit.platform,edit.metricKey,edit.value);removeMetricEdit(edit,clientId);week[edit.platform]={...(week[edit.platform]||{}),[edit.metricKey]:edit.value};synced++}
   catch(error){console.error(`Não foi possível sincronizar a métrica ${clientId}/${edit.weekKey}/${edit.metricKey}:`,error);pending++}
  }
  for(const pendingLink of pendingCreativeLinks(clientId)){
   try{await window.performanceDb.saveCreativeLink(clientId,pendingLink.weekKey,pendingLink.value);removePendingCreativeLink(pendingLink.weekKey,clientId);synced++}
   catch(error){console.error(`Não foi possível sincronizar a peça ${clientId}/${pendingLink.weekKey}:`,error);pending++}
  }
 }
 return{synced,pending};
}
window.syncPendingImports=syncPendingImports;
const active=()=>weeks.find(x=>x.key===selected)||weeks.at(-1),previous=()=>{const i=weeks.findIndex(x=>x.key===selected);return i>0?weeks[i-1]:null};
let periodMode="week";
const monthOf=k=>k.slice(0,7);
const monthNames=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const monthLabel=mk=>{const[y,m]=mk.split("-");return`${monthNames[+m-1]}/${y}`};
const cumulativeMetricKeys=new Set(["followers","subscribers"]);
const ratioMetricPairs={cpl:"leads",costPerMessage:"messages",costPerResult:"results",costVisit:"visits",webinarCpl:"webinarLeads",cadastroCpl:"cadastroLeads"};
function aggregateWeeks(list,platform){
 if(!list.length)return null;
 const keys=new Set();list.forEach(w=>Object.keys(w[platform]||{}).forEach(k=>keys.add(k)));
 const out={};
 keys.forEach(k=>{
  if(cumulativeMetricKeys.has(k)){const last=[...list].reverse().find(w=>Number.isFinite(w[platform]?.[k]));out[k]=last?last[platform][k]:null}
  else if(ratioMetricPairs[k]){const countKey=ratioMetricPairs[k];let numerator=0,denom=0,any=false;list.forEach(w=>{const cost=w[platform]?.[k],count=w[platform]?.[countKey];if(Number.isFinite(cost)&&Number.isFinite(count)&&count>0){numerator+=cost*count;denom+=count;any=true}});out[k]=any&&denom?numerator/denom:null}
  else{let sum=0,any=false;list.forEach(w=>{const v=w[platform]?.[k];if(Number.isFinite(v)){sum+=v;any=true}});out[k]=any?sum:null}
 });
 return out;
}
function periodViewFor(cur,prev){
 if(periodMode!=="month"||!cur)return{cur,prev};
 const mk=monthOf(cur.key),months=[...new Set(weeks.map(w=>monthOf(w.key)))].sort(),idx=months.indexOf(mk),list=weeks.filter(w=>monthOf(w.key)===mk),prevMk=idx>0?months[idx-1]:null,prevList=prevMk?weeks.filter(w=>monthOf(w.key)===prevMk):[];
 const aggCur={...cur,date:monthLabel(mk),meta:aggregateWeeks(list,"meta")||{},google:clients[client].google?aggregateWeeks(list,"google"):null};
 const aggPrev=prevList.length?{...prevList.at(-1),date:monthLabel(prevMk),meta:aggregateWeeks(prevList,"meta")||{},google:clients[client].google?aggregateWeeks(prevList,"google"):null}:null;
 return{cur:aggCur,prev:aggPrev};
}
const fmt=(v,f)=>f==="brl"?brl(v):num(v);
const variation=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&b!==0?(a-b)/Math.abs(b)*100:null;
function delta(cur,prev,m){
 if(!Number.isFinite(cur)||!Number.isFinite(prev))return'<em class="delta neutral">—</em>';
 const d=cur-prev;if(m.arrow)return`<em class="delta ${d>0?"good":d<0?"bad":"neutral"}" title="Anterior: ${fmt(prev,m.format)}">${d>0?"↑":d<0?"↓":"→"}</em>`;
 const pct=variation(cur,prev);if(pct===null)return'<em class="delta neutral">—</em>';
 const cls=Math.abs(pct)<.05?"neutral":(m.inverse?pct<0:pct>0)?"good":"bad";
 return`<em class="delta ${cls}" title="Anterior: ${fmt(prev,m.format)}">${pct>0?"↑":pct<0?"↓":"→"} ${Math.abs(pct).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1})}%</em>`;
}
function metrics(el,defs,cur={},prev={},platform){const editable=periodMode==="week";el.innerHTML=defs.map(m=>`<div class="metric-row${m.big?" emphasis":""}${editable?" editable":""}"><span>${m.label}</span><strong>${fmt(cur?.[m.key],m.format)}</strong>${delta(cur?.[m.key],prev?.[m.key],m)}${editable?`<button class="metric-value-edit" type="button" data-platform="${platform}" data-metric="${m.key}" aria-label="Editar valor de ${esc(m.label)}" title="Editar valor"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4z"/></svg></button>`:""}</div>`).join("");el.querySelectorAll(".metric-value-edit").forEach(button=>button.onclick=()=>openMetricValueEditor(button.dataset.platform,button.dataset.metric))}
function health(defs,cur,prev){let score=0,n=0;defs.filter(m=>!m.arrow).forEach(m=>{const v=variation(cur?.[m.key],prev?.[m.key]);if(v===null)return;n++;if(Math.abs(v)<.05)return;score+=(m.inverse?v<0:v>0)?1:-1});return!n?{text:"Sem comparação",cls:"neutral"}:score>0?{text:"Melhorou",cls:"good"}:score<0?{text:"Piorou",cls:"bad"}:{text:"Estável",cls:"neutral"}}
function setHealth(id,h){$(id).textContent=h.text;$(id).className=`platform-health ${h.cls}`}
const compact=n=>n>=1000?`R$ ${(n/1000).toLocaleString("pt-BR",{maximumFractionDigits:1})} mil`:brl(n);
function populate(){
 const austral=Object.assign(document.createElement("option"),{value:"__austral__",textContent:"Austral"});
 $("client-select").replaceChildren(austral,...Object.entries(clients).map(([id,c])=>Object.assign(document.createElement("option"),{value:id,textContent:c.name})));
 $("client-select").value=appView==="overview"?"__austral__":client;
}
function platformSpend(values={}){
 values=values||{};
 if(Number.isFinite(values.spend))return values.spend;
 if(Number.isFinite(values.costPerResult)&&Number.isFinite(values.results))return values.costPerResult*values.results;
 if(Number.isFinite(values.cpl)&&Number.isFinite(values.leads))return values.cpl*values.leads;
 if(Number.isFinite(values.costVisit)&&Number.isFinite(values.visits))return values.costVisit*values.visits;
 return null;
}
function accountResults(week){
 if(!week)return null;
 const meta=Number.isFinite(week.meta?.results)?week.meta.results:[week.meta?.leads,week.meta?.messages].filter(Number.isFinite).reduce((sum,value)=>sum+value,0);
 const google=Number.isFinite(week.google?.leads)?week.google.leads:0;
 const hasMeta=Number.isFinite(week.meta?.results)||Number.isFinite(week.meta?.leads)||Number.isFinite(week.meta?.messages);
 return hasMeta||Number.isFinite(week.google?.leads)?meta+google:null;
}
function accountSpend(week){
 if(!week)return null;const values=[platformSpend(week.meta),platformSpend(week.google)].filter(Number.isFinite);return values.length?values.reduce((sum,value)=>sum+value,0):null;
}
function overviewStatus(cur,prev){
 const change=variation(accountResults(cur),accountResults(prev));
 if(change===null)return{text:"Sem comparação",cls:"neutral"};
 if(change>5)return{text:"Evolução",cls:"good"};
 if(change<-5)return{text:"Atenção",cls:"bad"};
 return{text:"Estável",cls:"neutral"};
}
function renderOverview(){
 const entries=Object.entries(clients).map(([id,c])=>{const ordered=[...(c.weeks||[])].sort((a,b)=>a.key.localeCompare(b.key));const cur=ordered.at(-1),prev=ordered.at(-2);return{id,c,cur,prev,state:overviewStatus(cur,prev),results:accountResults(cur),spend:accountSpend(cur)}});
 const budget=entries.reduce((sum,{c})=>sum+(Number(c.metaBudget)||0)+(Number(c.googleBudget)||0),0),spendValues=entries.map(x=>x.spend).filter(Number.isFinite),resultValues=entries.map(x=>x.results).filter(Number.isFinite),totalSpend=spendValues.reduce((a,b)=>a+b,0),totalResults=resultValues.reduce((a,b)=>a+b,0);
 $("overview-budget").textContent=brl(budget);$("overview-spend").textContent=spendValues.length?brl(totalSpend):"—";$("overview-results").textContent=resultValues.length?num(totalResults):"—";$("overview-cpr").textContent=totalSpend&&totalResults?brl(totalSpend/totalResults):"—";
 const newest=entries.map(x=>x.cur?.key).filter(Boolean).sort().at(-1);$("overview-period").textContent=newest?`Últimas semanas importadas · atualização mais recente em ${newest.split("-").reverse().join("/")}`:"Importe uma semana para iniciar o consolidado.";
 $("portfolio-grid").innerHTML=entries.map(({id,c,cur,state,results,spend})=>{const theme=themeFor(id,c);return`<div class="portfolio-card-shell"><button class="portfolio-card" type="button" data-client="${id}" style="--card-accent:${theme.darkPrimary||theme.primary}"><span class="portfolio-brand" style="background:${theme.logoBg}">${brandMark(theme,c,"")}</span><span class="portfolio-name"><strong>${esc(c.name)}</strong><small>${cur?`Semana ${cur.date}`:"Sem semana cadastrada"}</small></span><span class="portfolio-metric"><small>Investimento</small><strong>${brl(spend)}</strong></span><span class="portfolio-metric"><small>Resultados</small><strong>${num(results)}</strong></span><span class="portfolio-state ${state.cls}">${state.text}</span><span class="portfolio-arrow" aria-hidden="true">→</span></button><button class="strategy-trigger" type="button" data-strategy-client="${id}" aria-label="Estratégia de ${esc(c.name)}" title="Estratégia de campanha"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></div>`}).join("");
 $("portfolio-grid").querySelectorAll("[data-client]").forEach(button=>button.onclick=()=>openClient(button.dataset.client));
 $("portfolio-grid").querySelectorAll("[data-strategy-client]").forEach(button=>button.onclick=event=>{event.stopPropagation();openStrategyDialog(button.dataset.strategyClient)});
}
function normStrategy(s){return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}
function parseCampaignDoc(text){
 const lines=String(text||"").split(/\r?\n/).map(l=>l.trim());
 const campaigns=[];let current=null,channel=null,mode=null,channelHeaderJustSet=false;
 const newCampaign=name=>({name:name||"Campanha",lp:"",channels:{meta:null,google:null}});
 const ensureCampaign=()=>{if(!current){current=newCampaign("Campanha");campaigns.push(current)}return current};
 const ensureChannel=key=>{const camp=ensureCampaign();if(!camp.channels[key])camp.channels[key]=key==="meta"?{objetivo:"",orcamento:"",publico:"",criativos:""}:{objetivo:"",orcamento:"",keywords:[],titulos:[],descricoes:[]};return camp.channels[key]};
 for(const raw of lines){
  if(!raw)continue;
  const n=normStrategy(raw);
  if(n==="meta ads"||n.startsWith("meta ads")){channel="meta";ensureChannel("meta");mode=null;channelHeaderJustSet=true;continue}
  if(n==="google ads"||n.startsWith("google ads")){channel="google";ensureChannel("google");mode=null;channelHeaderJustSet=true;continue}
  if(channelHeaderJustSet){
   channelHeaderJustSet=false;
   if(/^campanha\b/i.test(raw)&&channel){ensureChannel(channel).objetivo=raw;continue}
  }
  const campMatch=raw.match(/^campanha\s+(.+)$/i);
  if(campMatch){current=newCampaign(campMatch[1].trim());campaigns.push(current);channel=null;mode=null;continue}
  if(n==="lp"){mode="lp";continue}
  const orcMatch=raw.match(/or[çc]amento\s*:?\s*(.+)$/i);
  if(orcMatch&&channel){ensureChannel(channel).orcamento=orcMatch[1].trim();mode=null;continue}
  const pubMatch=raw.match(/p[uú]blico\s*:?\s*(.+)$/i);
  if(pubMatch&&channel==="meta"){ensureChannel("meta").publico=pubMatch[1].trim();mode=null;continue}
  if(n.startsWith("criativos")&&channel==="meta"){const inline=raw.split(":").slice(1).join(":").trim();if(inline){ensureChannel("meta").criativos=inline;mode=null}else mode="criativos";continue}
  if(n.includes("palavra")&&n.includes("chave")){mode="keywords";continue}
  if(n.includes("ideia")&&n.includes("anuncio")){mode="ads";continue}
  if(mode==="lp"){ensureCampaign().lp=raw;mode=null;continue}
  if(mode==="criativos"){ensureChannel("meta").criativos=raw;mode=null;continue}
  if(mode==="keywords"&&channel==="google"){const kw=raw.replace(/^["“”']+|["“”']+$/g,"").trim();if(kw)ensureChannel("google").keywords.push(kw);continue}
  if(mode==="ads"&&channel==="google"){
   const titleMatch=raw.match(/^t[ií]tulo\s*\d*\s*:?\s*(.+)$/i),descMatch=raw.match(/^descri[cç][aã]o\s*\d*\s*:?\s*(.+)$/i);
   if(titleMatch){ensureChannel("google").titulos.push(titleMatch[1].trim());continue}
   if(descMatch){ensureChannel("google").descricoes.push(descMatch[1].trim());continue}
  }
 }
 return campaigns.filter(c=>c.lp||c.channels.meta||c.channels.google);
}
function strategyChannelHtml(label,ch){
 if(!ch)return"";
 const rows=[];
 if(ch.objetivo)rows.push(`<p class="strategy-line"><span>Objetivo</span>${esc(ch.objetivo)}</p>`);
 if(ch.orcamento)rows.push(`<p class="strategy-line"><span>Orçamento</span>${esc(ch.orcamento)}</p>`);
 if(ch.publico)rows.push(`<p class="strategy-line"><span>Público</span>${esc(ch.publico)}</p>`);
 if(ch.criativos)rows.push(`<p class="strategy-line"><span>Criativos</span><a href="${esc(ch.criativos)}" target="_blank" rel="noopener noreferrer">${esc(ch.criativos)}</a></p>`);
 if(ch.keywords?.length)rows.push(`<div class="strategy-line strategy-chips"><span>Palavras-chave</span><div>${ch.keywords.map(k=>`<i>${esc(k)}</i>`).join("")}</div></div>`);
 if(ch.titulos?.length||ch.descricoes?.length)rows.push(`<div class="strategy-line strategy-ads"><span>Anúncios</span><div>${ch.titulos.map(t=>`<b>${esc(t)}</b>`).join("")}${ch.descricoes.map(d=>`<p>${esc(d)}</p>`).join("")}</div></div>`);
 if(!rows.length)return"";
 return `<div class="strategy-channel"><h4>${label}</h4>${rows.join("")}</div>`;
}
function strategyEntryHtml(row){
 const campaigns=Array.isArray(row.campaigns)?row.campaigns:[];
 const when=new Date(row.created_at);
 const whenText=Number.isNaN(when.getTime())?"":when.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"});
 const cards=campaigns.map(camp=>`<article class="strategy-campaign"><h3>${esc(camp.name)}</h3>${camp.lp?`<p class="strategy-line"><span>LP</span><a href="${esc(camp.lp)}" target="_blank" rel="noopener noreferrer">${esc(camp.lp)}</a></p>`:""}${strategyChannelHtml("Meta Ads",camp.channels?.meta)}${strategyChannelHtml("Google Ads",camp.channels?.google)}</article>`).join("");
 const fallback=!cards&&row.raw_text?`<p class="strategy-raw">${esc(row.raw_text).replace(/\n/g,"<br>")}</p>`:"";
 return `<div class="strategy-entry" data-strategy-id="${row.id}"><div class="strategy-entry-head"><small>${whenText}${row.created_by?` · ${esc(row.created_by)}`:""}</small><button class="strategy-delete" type="button" data-strategy-delete="${row.id}" aria-label="Remover esta estratégia" title="Remover">×</button></div>${row.doc_link?`<a class="strategy-doc-link" href="${esc(row.doc_link)}" target="_blank" rel="noopener noreferrer">Abrir doc original</a>`:""}${cards||fallback||"<p class=\"strategy-raw strategy-empty\">Sem conteúdo reconhecido.</p>"}</div>`;
}
function renderStrategyList(clientId){
 const rows=clients[clientId]?.strategies||[];
 $("strategy-list").innerHTML=rows.length?rows.map(strategyEntryHtml).join(""):'<p class="strategy-raw strategy-empty">Nenhuma estratégia registrada ainda para este cliente.</p>';
 $("strategy-list").querySelectorAll("[data-strategy-delete]").forEach(button=>button.onclick=async()=>{
  if(!confirm("Remover esta estratégia do histórico?"))return;
  const id=button.dataset.strategyDelete;
  try{await window.performanceDb?.deleteStrategy(id);clients[clientId].strategies=(clients[clientId].strategies||[]).filter(r=>String(r.id)!==String(id));renderStrategyList(clientId)}catch(error){console.error(error);alert("Não foi possível remover. Tente novamente.")}
 });
}
let editingStrategyClient=null;
function openStrategyDialog(clientId){
 editingStrategyClient=clientId;
 const c=clients[clientId];if(!c)return;
 $("strategy-title").textContent=`Estratégia · ${c.name}`;
 $("strategy-link").value="";$("strategy-text").value="";$("strategy-feedback").textContent="";$("strategy-feedback").className="strategy-feedback";
 renderStrategyList(clientId);
 $("strategy-dialog").showModal();
}
async function saveStrategyEntry(event){
 event.preventDefault();
 const clientId=editingStrategyClient;if(!clientId)return;
 const docLink=$("strategy-link").value.trim(),rawText=$("strategy-text").value.trim();
 if(!docLink&&!rawText){$("strategy-feedback").textContent="Cole o texto ou informe ao menos o link do doc.";$("strategy-feedback").className="strategy-feedback error";return}
 const submit=$("strategy-form").querySelector('[type="submit"]');submit.disabled=true;$("strategy-feedback").textContent="Salvando…";$("strategy-feedback").className="strategy-feedback";
 try{
  const campaigns=rawText?parseCampaignDoc(rawText):[];
  const saved=await window.performanceDb?.saveStrategy(clientId,{docLink,rawText,campaigns});
  if(saved){clients[clientId].strategies=[saved,...(clients[clientId].strategies||[])]}
  $("strategy-link").value="";$("strategy-text").value="";
  $("strategy-feedback").textContent="Estratégia salva.";$("strategy-feedback").className="strategy-feedback success";
  renderStrategyList(clientId);
 }catch(error){console.error(error);$("strategy-feedback").textContent="Não foi possível salvar. Tente novamente.";$("strategy-feedback").className="strategy-feedback error"}
 finally{submit.disabled=false}
}
function updateAccessButton(){
 const newBtn=$("client-new-open");if(newBtn)newBtn.hidden=!window.accessControl?.isOwner||appView!=="overview";
 const btn=$("access-open");if(!btn)return;btn.hidden=!window.accessControl?.isOwner||appView!=="overview";
}
const suggestInitials=name=>{const words=name.trim().split(/\s+/).filter(Boolean);return(words.length>1?words[0][0]+words[1][0]:name.trim().slice(0,2)).toUpperCase()};
const slugify=name=>name.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
function openNewClient(){
 $("client-new-form").reset();$("client-new-google-field").hidden=true;$("client-new-feedback").textContent="A logo pode ser adicionada depois; por enquanto o painel usa as iniciais na cor da marca.";$("client-new-feedback").className="budget-feedback";$("client-new-dialog").showModal();$("client-new-name").focus();
}
async function saveNewClient(event){
 event.preventDefault();
 const name=$("client-new-name").value.trim(),initials=$("client-new-initials").value.trim().toUpperCase(),feedback=$("client-new-feedback"),submit=event.currentTarget.querySelector('[type="submit"]');
 let id=slugify(name);
 if(!name||!id||initials.length<1){feedback.textContent="Informe o nome e as iniciais do cliente.";feedback.className="budget-feedback error";return}
 if(clients[id]){feedback.textContent="Já existe um cliente com esse nome.";feedback.className="budget-feedback error";return}
 const hasGoogle=$("client-new-has-google").checked,preset=newClientPresets[$("client-new-model").value]||newClientPresets.leads;
 submit.disabled=true;feedback.textContent="Criando cliente…";feedback.className="budget-feedback";
 try{
  await window.performanceDb.createClient({id,name,initials,brand_color:$("client-new-color").value,meta_budget:Number($("client-new-meta").value)||0,google_budget:hasGoogle?Number($("client-new-google").value)||0:null,has_google:hasGoogle,tracks_followers:$("client-new-followers").checked,tracks_youtube:$("client-new-youtube").checked,default_meta_metrics:preset.meta,default_google_metrics:hasGoogle?preset.google:[]});
  $("client-new-dialog").close();populate();renderOverview();
 }catch(error){console.error(error);feedback.textContent=error?.code==="42501"?"Somente o proprietário pode criar clientes.":"Não foi possível criar o cliente. Tente novamente.";feedback.className="budget-feedback error"}
 finally{submit.disabled=false}
}
window.updateAccessButton=updateAccessButton;
function showOverview(){
 appView="overview";localStorage.setItem(viewStorageKey,appView);$("overview").hidden=false;$("resumo").hidden=true;document.querySelector(".page-footer").hidden=true;document.querySelector(".skip-link").href="#overview";document.querySelector(".brand").href="#overview";$("overview-open").setAttribute("aria-pressed","true");document.querySelectorAll(".budget-strip,#week-select,.period-toggle,#history-open,#import-open,#history-import-open,#budget-open-mobile").forEach(el=>{if(el)el.closest("label")?el.closest("label").hidden=true:el.hidden=true});
 document.querySelector(".brand-mark").innerHTML='<img src="./logo-austral.jpg" alt="Logo Austral">';document.querySelector(".brand-copy strong").textContent="Austral";document.querySelector(".brand-copy small").textContent="Visão geral de performance";document.title="Austral | Visão geral";if($("client-select"))$("client-select").value="__austral__";renderOverview();updateAccessButton();
}
function openClient(clientId=client){
 if(clients[clientId])client=clientId;localStorage.setItem("performance-v2-client",client);appView="client";localStorage.setItem(viewStorageKey,appView);$("overview").hidden=true;$("resumo").hidden=false;document.querySelector(".page-footer").hidden=false;document.querySelector(".skip-link").href="#resumo";document.querySelector(".brand").href="#resumo";$("overview-open").setAttribute("aria-pressed","false");document.querySelectorAll(".budget-strip,#week-select,.period-toggle,#history-open,#import-open,#history-import-open,#budget-open-mobile").forEach(el=>{if(el)el.closest("label")?el.closest("label").hidden=false:el.hidden=false});$("client-select").value=client;selected=localStorage.getItem(selectedStorageKey(client))||"";loadWeeks();render();updateAccessButton();
}
function weekOptions(){$("week-select").replaceChildren(...weeks.slice().reverse().map(w=>Object.assign(document.createElement("option"),{value:w.key,textContent:w.date})));$("week-select").value=selected}
function brand(){
 const c=clients[client],theme=themeFor(client,clients[client]),root=document.documentElement;document.querySelector(".brand-copy strong").textContent=c.name;document.querySelector(".brand").ariaLabel=`${c.name} — início`;
 document.title=`${c.name} | Resumo rápido da conta`;
 root.style.setProperty("--blue",root.dataset.theme==="dark"?(theme.darkPrimary||theme.primary):theme.primary);root.style.setProperty("--brand-soft",theme.soft);root.style.setProperty("--brand-accent",theme.accent);root.style.setProperty("--brand-logo-bg",theme.logoBg);
 const mark=document.querySelector(".brand-mark");mark.innerHTML=brandMark(theme,c,`Logo ${esc(c.name)}`);
 document.querySelector(".brand-copy small").textContent="Reunião de performance";
 $("meta-budget").textContent=compact(c.metaBudget);$("google-budget-label").hidden=!c.google;if(c.google)$("google-budget").textContent=compact(c.googleBudget);
 $("google-card").hidden=!c.google;document.querySelector(".platforms").classList.toggle("single",!c.google);
 const hideCreative=c.showCreative===false;$("creative-toggle").setAttribute("aria-pressed",String(!hideCreative));$("ad-body").hidden=hideCreative;$("ad-empty").hidden=!hideCreative;
}

function openBudgetEditor(){
 const c=clients[client];$("budget-title").textContent=`Editar orçamento · ${c.name}`;$("budget-scope").textContent="Atualize os valores mensais previstos para as plataformas desta conta.";$("meta-budget-input").value=Number(c.metaBudget||0);$("google-budget-field").hidden=!c.google;$("google-budget-input").required=c.google;$("google-budget-input").value=c.google?Number(c.googleBudget||0):"";$("budget-feedback").textContent="Os valores serão salvos no cadastro deste cliente.";$("budget-feedback").className="budget-feedback";$("budget-dialog").showModal();
}
async function saveBudgets(event){
 event.preventDefault();const c=clients[client],meta=Number($("meta-budget-input").value),google=c.google?Number($("google-budget-input").value):null;
 if(!Number.isFinite(meta)||meta<0||c.google&&(!Number.isFinite(google)||google<0)){$("budget-feedback").textContent="Informe valores iguais ou maiores que zero.";$("budget-feedback").className="budget-feedback error";return}
 const submit=$("budget-form").querySelector('[type="submit"]');submit.disabled=true;$("budget-feedback").textContent="Salvando orçamento…";
 try{if(window.performanceDb?.ready)await window.performanceDb.saveBudgets(client,meta,google);c.metaBudget=meta;c.googleBudget=google;brand();$("budget-feedback").textContent="Orçamento atualizado no Supabase.";$("budget-feedback").className="budget-feedback success";setTimeout(()=>$("budget-dialog").close(),550)}catch(error){console.error(error);$("budget-feedback").textContent="Não foi possível salvar. Tente novamente.";$("budget-feedback").className="budget-feedback error"}finally{submit.disabled=false}
}
function status(cur,prev){
 const c=clients[client],metaDefs=effectiveMetrics("meta"),googleDefs=c.google?effectiveMetrics("google"):[],mh=health(metaDefs,cur.meta,prev?.meta),gh=c.google?health(googleDefs,cur.google,prev?.google):null;setHealth("meta-health",mh);if(gh)setHealth("google-health",gh);
 const bad=[mh,gh].filter(Boolean).some(x=>x.cls==="bad"),good=[mh,gh].filter(Boolean).some(x=>x.cls==="good");
 $("status-title").innerHTML=bad?`Conta pede atenção. <span>${good?"Há evolução em outra frente.":"Revise os indicadores."}</span>`:good?'Semana positiva. <span>Os principais indicadores evoluíram.</span>':'Conta estável. <span>Sem mudança conclusiva.</span>';
 $("status-pill").textContent=bad?"Atenção":good?"Evolução":"Estável";
 const first=metaDefs[0],v=variation(cur.meta?.[first.key],prev?.meta?.[first.key]),g=c.google?variation(cur.google?.leads,prev?.google?.leads):null,p=[];
 if(v!==null)p.push(`${first.label} no Meta ${v>=0?"subiram":"caíram"} ${Math.abs(v).toLocaleString("pt-BR",{maximumFractionDigits:1})}%`);
 if(g!==null)p.push(`leads no Google ${g>=0?"subiram":"caíram"} ${Math.abs(g).toLocaleString("pt-BR",{maximumFractionDigits:1})}%`);
 $("status-copy").textContent=p.length?`${p.join(". ")}.`:"Ainda não há base suficiente para comparar esta semana.";
}
const esc=s=>{const d=document.createElement("div");d.textContent=String(s??"");return d.innerHTML};
function renderActions(cur){
 const saved=window.performanceDb?.ready?null:json(key(`actions-${selected}`),null);actions=saved||(cur.actions||[]).map(action=>Array.isArray(action)?{title:action[0],meta:action[1],done:false}:{...action});
 $("action-list").innerHTML=actions.length?actions.map((a,i)=>`<label class="action-item"><input type="checkbox" data-i="${i}" ${a.done?"checked":""}><span class="check-box"></span><span><strong>${esc(a.title)}</strong><small>${esc(a.meta||"Prazo a definir")}</small></span></label>`).join(""):'<p class="empty-actions">Nenhuma ação registrada nesta semana.</p>';
 $("action-list").querySelectorAll("input").forEach(i=>i.onchange=async()=>{const index=+i.dataset.i,previous=actions[index].done,targetClient=client,targetDate=selected,snapshot=actions.map(action=>({...action}));snapshot[index].done=i.checked;actions=snapshot;const cur=active();if(cur)cur.actions=snapshot.map(action=>({...action}));pending();try{const persisted=await saveActions(targetClient,targetDate,snapshot);if(client===targetClient&&selected===targetDate)persisted.forEach((saved,position)=>{const current=actions[position];if(current&&!current.id&&current.title===saved.title)current.id=saved.id})}catch{if(client===targetClient&&selected===targetDate){actions[index].done=previous;const current=active();if(current)current.actions=actions.map(action=>({...action}));renderActions(current)}}});pending();
}
async function saveActions(targetClient=client,targetDate=selected,nextActions=actions){const snapshot=nextActions.map(action=>({...action}));localStorage.setItem(`performance-v2-actions-${targetDate}-${targetClient}`,JSON.stringify(snapshot));const targetWeek=clients[targetClient]?.weeks.find(week=>week.key===targetDate);if(targetWeek)targetWeek.actions=snapshot.map(action=>({...action}));if(client===targetClient&&selected===targetDate)pending();if(!window.performanceDb?.ready)return snapshot;const persisted=await window.performanceDb.saveActions(targetClient,targetDate,snapshot);if(targetWeek)targetWeek.actions=persisted.map(action=>({...action}));return persisted}
function pending(){const n=actions.filter(x=>!x.done).length;$("pending-count").textContent=`${n} ${n===1?"pendente":"pendentes"}`}
function render(){
 const c=clients[client],rawCur=active(),rawPrev=previous(),metaDefs=effectiveMetrics("meta"),googleDefs=c.google?effectiveMetrics("google"):[];
 if(!rawCur){
  brand();$("week-select").replaceChildren();$("meta-metrics").replaceChildren();$("google-metrics").replaceChildren();$("status-title").textContent="Sem semanas cadastradas";$("status-copy").textContent="Use “Importar semana” para registrar os primeiros dados desta conta.";$("status-pill").textContent="Novo";$("quick-notes").value="";
  setHealth("meta-health",{text:"Sem dados",cls:"neutral"});setHealth("google-health",{text:"Sem dados",cls:"neutral"});$("meta-insight")&&($("meta-insight").textContent="");$("google-insight").textContent="";
  renderActions({actions:[]});
  return;
 }
 const{cur,prev}=periodViewFor(rawCur,rawPrev);
 brand();weekOptions();metrics($("meta-metrics"),metaDefs,cur.meta,prev?.meta,"meta");
 if(c.google)metrics($("google-metrics"),googleDefs,cur.google||{},prev?.google||{},"google");status(cur,prev);renderActions(rawCur);
 $("quick-notes").value=window.performanceDb?.ready?(rawCur.note||""):(localStorage.getItem(key(`notes-${selected}`))||rawCur.note||"");
 const sourceLabel=periodMode==="month"?"Consolidado do mês":(rawCur.source==="csv"||rawCur.period?"CSV semanal":"Registro do documento");
 $("meta-source-label").textContent=sourceLabel;if(c.google)$("google-source-label").textContent=sourceLabel;
 $("google-insight").textContent=c.google?googleInsight(cur,prev):"";
 $("footer-updated").textContent=periodMode==="month"?`Consolidado de ${cur.date}`:`Atualizado em ${rawCur.date}`;$("footer-source").textContent=c.google?"Meta + Google · comparação semanal":"Meta Ads · comparação semanal";
 $("history-meta-count").textContent=metaDefs[0].label;$("history-meta-cost").textContent=metaDefs.find(x=>x.inverse)?.label||"Custo Meta";renderCreative();
}
function googleInsight(cur,prev){if(!cur.google)return"Sem dados do Google nesta semana.";const d=Number.isFinite(cur.google.leads)&&Number.isFinite(prev?.google?.leads)?cur.google.leads-prev.google.leads:null,p=variation(cur.google.cpl,prev?.google?.cpl);if(d===null&&p===null)return"Sem comparação com a semana anterior.";if(d===0&&(p===null||Math.abs(p)<.05))return"Leads e CPL estáveis em relação à semana anterior.";return`${d===null?"":d===0?"Leads estáveis":`${Math.abs(d)} ${Math.abs(d)===1?"lead":"leads"} ${d>0?"a mais":"a menos"}`}${d!==null&&p!==null?" e ":""}${p===null?"":Math.abs(p)<.05?"CPL estável":`CPL ${p>0?"maior":"menor"} em ${Math.abs(p).toLocaleString("pt-BR",{maximumFractionDigits:1})}%`} que na semana anterior.`}
function history(){
 const c=clients[client],cur=active(),defs=effectiveMetrics("meta"),first=defs[0],cost=defs.find(x=>x.inverse);$("history-title").textContent=`Histórico · ${c.name}`;
 $("history-summary").innerHTML=[["Semanas",weeks.length],["Semana atual",cur.date],[first.label,fmt(cur.meta?.[first.key],first.format)],[cost?.label||"Google leads",cost?fmt(cur.meta?.[cost.key],cost.format):num(cur.google?.leads)]].map(x=>`<span><small>${x[0]}</small><strong>${x[1]}</strong></span>`).join("");
 $("history-body").innerHTML=weeks.slice().reverse().map(w=>`<tr class="${w.key===selected?"selected":""}"><td>${w.date}</td><td>${fmt(w.meta?.[first.key],first.format)}</td><td>${cost?fmt(w.meta?.[cost.key],cost.format):"—"}</td><td>${num(w.meta?.visits??w.meta?.profileVisits??w.meta?.clicks)}</td><td>${num(w.meta?.followers)}</td><td>${num(w.google?.leads)}</td><td>${brl(w.google?.cpl)}</td></tr>`).join("");
 document.querySelector(".history-note").textContent="As variações usam sempre o registro imediatamente anterior do mesmo cliente. Campos ausentes aparecem como “—”.";
}

const creativeKey=kind=>key(`${kind}-${selected}`);
function adLink(){const pending=pendingCreativeLink(),saved=localStorage.getItem(creativeKey("ad"))||"";return pending!==undefined?pending:(active()?.creative?.instagram_url||saved)}
function embed(url){const m=url.match(/instagram\.com\/(p|reel)\/([^/?#]+)/i);return m?`https://www.instagram.com/${m[1]}/${m[2]}/embed/captioned/`:""}
function renderCreative(){
 const link=adLink(),image=window.performanceDb?.ready?active()?.creative?.signedUrl:localStorage.getItem(creativeKey("creative")),frame=$("instagram-frame"),manual=$("manual-creative"),fallback=$("ad-preview-link"),e=embed(link);
 $("ad-open").href=link||"#";$("ad-open").setAttribute("aria-disabled",String(!link));$("ad-url-display").href=link||"#";$("ad-url-display").textContent=link?link.replace(/^https?:\/\/(www\.)?/,""):"Nenhum link associado";$("clear-creative-image").hidden=!image;
 if(image){manual.src=image;manual.hidden=false;frame.hidden=true;fallback.hidden=true;$("creative-status").textContent="Print do criativo carregado.";return}
 manual.hidden=true;if(e){frame.src=e;frame.hidden=false;fallback.hidden=true;$("creative-status").textContent="Publicação carregada do Instagram."}else{frame.hidden=true;fallback.hidden=false;fallback.href=link||"#";fallback.setAttribute("aria-disabled",String(!link));$("creative-status").textContent=link?"Prévia indisponível; abra o link ou envie um print.":"Adicione o link ou envie um print do criativo."}
}

const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^\p{L}\p{N}]+/gu," ").trim();
function numeric(v){let s=String(v??"").trim().replace(/[R$\s%]/g,"");if(!s||s==="—")return null;if(s.includes(",")&&s.includes("."))s=s.lastIndexOf(",")>s.lastIndexOf(".")?s.replace(/\./g,"").replace(",","."):s.replace(/,/g,"");else if(s.includes(","))s=s.replace(/\./g,"").replace(",",".");const n=Number(s);return Number.isFinite(n)?n:null}
let editingMetricValue=null;
function metricDefinitionFor(platform,metricKey){return effectiveMetrics(platform).find(metric=>metric.key===metricKey)||metricCatalogFor(platform).find(metric=>metric.key===metricKey)}
function openMetricValueEditor(platform,metricKey){
 if(periodMode!=="week")return;
 const week=active(),definition=metricDefinitionFor(platform,metricKey);if(!week||!definition)return;
 editingMetricValue={clientId:client,weekKey:week.key,platform,metricKey,format:definition.format};
 $("metric-value-title").textContent=`Editar ${definition.label}`;
 $("metric-value-scope").textContent=`${clients[client].name} · ${week.date} · ${platform==="google"?"Google Ads":"Meta e Instagram"}`;
 $("metric-value-label").textContent=definition.label;
 const value=week[platform]?.[metricKey];$("metric-value-input").value=Number.isFinite(value)?String(value).replace(".",","):"";
 $("metric-value-feedback").textContent="A alteração vale somente para esta semana.";$("metric-value-feedback").className="budget-feedback";
 $("metric-value-dialog").showModal();setTimeout(()=>$("metric-value-input").focus(),0);
}
async function persistMetricValue(value){
 if(!editingMetricValue)return;
 const edit={...editingMetricValue,value},week=weeks.find(item=>item.key===edit.weekKey);if(!week)return;
 week[edit.platform]=week[edit.platform]||{};week[edit.platform][edit.metricKey]=value;
 clients[edit.clientId].weeks=mergeWeek(clients[edit.clientId].weeks,week);cacheWeek(week,edit.clientId);queueMetricEdit(edit,edit.clientId);render();
 const feedback=$("metric-value-feedback");feedback.textContent="Valor salvo neste navegador. Sincronizando…";feedback.className="budget-feedback";
 if(!window.performanceDb?.ready){feedback.textContent="Valor salvo neste navegador. A sincronização ocorrerá quando o banco reconectar.";return}
 try{await window.performanceDb.saveMetricValue(edit.clientId,week,edit.platform,edit.metricKey,value);removeMetricEdit(edit,edit.clientId);feedback.textContent="Valor atualizado no Supabase.";feedback.className="budget-feedback success";setTimeout(()=>$("metric-value-dialog").close(),650)}
 catch(error){console.error(error);feedback.textContent="Valor salvo neste navegador. O envio ao Supabase ficou pendente e será tentado novamente.";feedback.className="budget-feedback error"}
}
async function saveMetricValue(event){event.preventDefault();const submit=event.currentTarget.querySelector('[type="submit"]'),value=numeric($("metric-value-input").value),feedback=$("metric-value-feedback");if(value===null||value<0){feedback.textContent="Informe um número igual ou maior que zero.";feedback.className="budget-feedback error";$("metric-value-input").focus();return}submit.disabled=true;try{await persistMetricValue(value)}finally{submit.disabled=false}}
async function clearMetricValue(){const button=$("metric-value-clear");button.disabled=true;try{await persistMetricValue(null);$("metric-value-input").value=""}finally{button.disabled=false}}
function csv(text){
 const lines=text.replace(/^\uFEFF/,""),first=lines.split(/\r?\n/).find(Boolean)||"",sep=(first.match(/;/g)||[]).length>(first.match(/,/g)||[]).length?";":",",rows=[];let row=[],cell="",quote=false;
 for(let i=0;i<lines.length;i++){const ch=lines[i];if(ch==='"'){if(quote&&lines[i+1]==='"'){cell+='"';i++}else quote=!quote}else if(ch===sep&&!quote){row.push(cell);cell=""}else if((ch==="\n"||ch==="\r")&&!quote){if(ch==="\r"&&lines[i+1]==="\n")i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell=""}else cell+=ch}row.push(cell);if(row.some(x=>x.trim()))rows.push(row);
 const hi=rows.findIndex(r=>r.length>3&&r.some(v=>["campanha","campaign","nome da campanha"].includes(norm(v))));if(hi<0)throw Error("Não encontrei a coluna de campanha.");const heads=rows[hi].map(norm);return rows.slice(hi+1).map(r=>Object.fromEntries(heads.map((h,i)=>[h,r[i]??""]))).filter(r=>Object.values(r).some(Boolean));
}
function pick(row,names){for(const n of names){if(Object.hasOwn(row,n)&&row[n]!=="")return row[n]}for(const n of names){const k=Object.keys(row).find(x=>x.includes(n));if(k&&row[k]!=="")return row[k]}return""}
function metaAggregate(rows){
 const x={lead:0,leadSpend:0,messages:0,messageSpend:0,spend:0,visits:0,trafficSpend:0,clicks:0,profile:0,webinar:0,webinarSpend:0,cadastro:0,cadastroSpend:0};let hasLead=false,hasMessages=false,hasTraffic=false;
 rows.forEach(r=>{const campaign=norm(pick(r,["nome da campanha","campanha","campaign"])),type=norm(pick(r,["tipo de resultado","indicador de resultados","result type","result indicator"]));if(!campaign||/^total/.test(campaign))return;const result=numeric(pick(r,["resultados","results","conversoes","conversions"]))||0,spend=numeric(pick(r,["valor usado","valor gasto","amount spent","custo","cost"]))||0,lp=numeric(pick(r,["visualizacoes da pagina de destino","landing page views"]))||0,profile=numeric(pick(r,["visitas ao perfil","profile visits"]))||0,profileResult=/profile.?visit|visita.?perfil/.test(type)?result:0,clicks=numeric(pick(r,["cliques no link","link clicks","cliques","clicks"]))||0,text=`${campaign} ${type}`,follower=/seguidor|follower/.test(text),message=/mensag|whatsapp|conversa|conversation|messaging/.test(text),tra=/trafego|traffic|visita|perfil|landing|pagina de destino|profile.?visit/.test(text),lead=!follower&&!message&&/lead|cadastro|captacao|formulario|form|webinar|conversao/.test(text);x.spend+=spend;
  if(message){x.messages+=result;x.messageSpend+=spend;hasMessages=true}
  if(lead){x.lead+=result;x.leadSpend+=spend;hasLead=true;if(/webinar/.test(campaign)){x.webinar+=result;x.webinarSpend+=spend}if(/cadastro/.test(campaign)){x.cadastro+=result;x.cadastroSpend+=spend}}
  if(tra||lp||profile||profileResult){x.visits+=lp||profile||profileResult||result;x.profile+=profile||profileResult;x.clicks+=clicks;x.trafficSpend+=spend;hasTraffic=true}
 });
 const results=x.lead+x.messages,resultSpend=x.leadSpend+x.messageSpend;
 return{results:hasLead||hasMessages?results:null,costPerResult:results?resultSpend/results:null,leads:hasLead?x.lead:null,cpl:hasLead&&x.lead?x.leadSpend/x.lead:null,messages:hasMessages?x.messages:null,costPerMessage:hasMessages&&x.messages?x.messageSpend/x.messages:null,spend:x.spend||null,visits:hasTraffic?x.visits:null,costVisit:hasTraffic&&x.visits?x.trafficSpend/x.visits:null,clicks:x.clicks||null,profileVisits:x.profile||null,webinarLeads:x.webinar||null,webinarCpl:x.webinar?x.webinarSpend/x.webinar:null,cadastroLeads:x.cadastro||null,cadastroCpl:x.cadastro?x.cadastroSpend/x.cadastro:null};
}
let historyImportPreview=null;
function mondayFromIso(value){const date=new Date(`${value}T12:00:00`);if(Number.isNaN(date.getTime()))return null;date.setDate(date.getDate()-((date.getDay()+6)%7));return localIsoDate(date)}
function csvWithHeaders(text,required){
 const lines=text.replace(/^\uFEFF/,""),first=lines.split(/\r?\n/).find(Boolean)||"",sep=(first.match(/;/g)||[]).length>(first.match(/,/g)||[]).length?";":",",rows=[];let row=[],cell="",quote=false;
 for(let i=0;i<lines.length;i++){const ch=lines[i];if(ch==='"'){if(quote&&lines[i+1]==='"'){cell+='"';i++}else quote=!quote}else if(ch===sep&&!quote){row.push(cell);cell=""}else if((ch==="\n"||ch==="\r")&&!quote){if(ch==="\r"&&lines[i+1]==="\n")i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell=""}else cell+=ch}row.push(cell);if(row.some(x=>x.trim()))rows.push(row);
 const hi=rows.findIndex(r=>required.every(header=>r.map(norm).includes(header)));if(hi<0)throw Error(`Não encontrei as colunas: ${required.join(", ")}.`);const heads=rows[hi].map(norm);return rows.slice(hi+1).map(r=>Object.fromEntries(heads.map((h,i)=>[h,r[i]??""]))).filter(r=>Object.values(r).some(Boolean));
}
function historicalMetaPreview(rows){
 const now=new Date(),today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`,grouped=new Map();
 rows.forEach(row=>{const date=pick(row,["inicio dos relatorios","reporting starts","report start","date"]);if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return;const key=mondayFromIso(date);if(!key||key>today)return;const current=grouped.get(key)||[];current.push(row);grouped.set(key,current)});
 const items=[];
 grouped.forEach((weekRows,key)=>{const meta=metaAggregate(weekRows),existing=clients[client].weeks.find(week=>week.key===key),missing={};Object.entries(meta).forEach(([metric,value])=>{if(Number.isFinite(value)&&!Number.isFinite(existing?.meta?.[metric]))missing[metric]=value});if(Object.keys(missing).length)items.push({key,meta:missing,days:new Set(weekRows.map(row=>pick(row,["inicio dos relatorios","reporting starts","report start","date"]))).size})});
 return items.sort((a,b)=>a.key.localeCompare(b.key));
}
function mergeHistoricalMeta(existing,incoming){const item=existing?{...existing,meta:{...(existing.meta||{})}}:W(incoming.key,{},null,[]);Object.entries(incoming.meta).forEach(([metric,value])=>{if(!Number.isFinite(item.meta[metric]))item.meta[metric]=value});item.source=existing?.source||"historical";return item}
function historicalGooglePreview(dailyRows,conversionRows){
 const now=new Date(),today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`,grouped=new Map(),add=(date,fn)=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return;const key=mondayFromIso(date);if(!key||key>today)return;const current=grouped.get(key)||{clicks:0,spend:0,leads:0,newSubscribers:0,days:new Set()};fn(current);current.days.add(date);grouped.set(key,current)};
 dailyRows.forEach(row=>add(pick(row,["dia","date"]),item=>{item.clicks+=numeric(pick(row,["cliques","clicks"]))||0;item.spend+=numeric(pick(row,["custo","cost"]))||0}));
 conversionRows.forEach(row=>add(pick(row,["dia","date"]),item=>{const action=norm(pick(row,["acao de conversao","conversion action"])),value=numeric(pick(row,["conversoes","conversions"]))||0;if(/youtube|inscri|subscriber/.test(action))item.newSubscribers+=value;else item.leads+=value}));
 const items=[];grouped.forEach((data,key)=>{const existing=clients[client].weeks.find(week=>week.key===key),google={},values={clicks:data.clicks,spend:data.spend,leads:data.leads,newSubscribers:data.newSubscribers};Object.entries(values).forEach(([metric,value])=>{if(Number.isFinite(value)&&!Number.isFinite(existing?.google?.[metric]))google[metric]=value});if(Object.keys(google).length)items.push({key,google,days:data.days.size})});return items.sort((a,b)=>a.key.localeCompare(b.key));
}
function mergeHistoricalGoogle(existing,incoming){const item=existing?{...existing,google:{...(existing.google||{})}}:W(incoming.key,{}, {},[]);Object.entries(incoming.google).forEach(([metric,value])=>{if(!Number.isFinite(item.google[metric]))item.google[metric]=value});item.source=existing?.source||"historical";return item}
async function importHistoricalCsv(){
 const feedback=$("history-preview"),preview=historyImportPreview,metaFile=$("history-meta-csv").files[0],googleDaily=$("history-google-daily-csv").files[0],googleConversions=$("history-google-conversions-csv").files[0];
 if(!preview)throw new Error("Selecione os CSVs e aguarde a prévia.");
 if(Boolean(googleDaily)!==Boolean(googleConversions))throw new Error("Para o Google, selecione os dois CSVs: diário e conversões.");
 const metaItems=preview.meta||[],googleItems=preview.google||[];
 if(!metaFile&&!googleDaily)throw new Error("Selecione ao menos um CSV histórico.");
 if(!metaItems.length&&!googleItems.length){feedback.textContent="Não há métricas ausentes nos CSVs selecionados para este cliente.";return}
 if(!window.performanceDb?.ready)throw new Error("Conecte-se ao Supabase antes de importar o histórico.");
 if(!confirm(`Importar o histórico e preencher somente métricas ausentes?`))return;
 const submit=$("import-submit");submit.disabled=true;feedback.textContent="Importando histórico…";
 try{let metrics=0,weeks=new Set();if(metaItems.length){const result=await window.performanceDb.importHistoricalData(client,"meta",metaItems);metrics+=result.metrics;metaItems.forEach(incoming=>{const existing=clients[client].weeks.find(week=>week.key===incoming.key),merged=mergeHistoricalMeta(existing,incoming);clients[client].weeks=mergeWeek(clients[client].weeks,merged);cacheWeek(merged,client);weeks.add(incoming.key)})}if(googleItems.length){const result=await window.performanceDb.importHistoricalData(client,"google",googleItems);metrics+=result.metrics;googleItems.forEach(incoming=>{const existing=clients[client].weeks.find(week=>week.key===incoming.key),merged=mergeHistoricalGoogle(existing,incoming);clients[client].weeks=mergeWeek(clients[client].weeks,merged);cacheWeek(merged,client);weeks.add(incoming.key)})}loadWeeks();render();feedback.textContent=`Histórico importado: ${weeks.size} semanas e ${metrics} métricas enviadas. Valores existentes foram preservados.`;historyImportPreview=null;["history-meta-csv","history-google-daily-csv","history-google-conversions-csv"].forEach(id=>$(id).value="");$("history-meta-file-name").textContent="Selecionar outro CSV";$("history-google-daily-file-name").textContent="Cliques e custo por dia";$("history-google-conversions-file-name").textContent="Dia, ação de conversão e conversões"}finally{submit.disabled=false}
}
function googleAggregate(rows){
 let leads=0,newSubscribers=0,found=false,campaignSpend=0,accountSpend=null,searchTotal=null,demandTotal=null,searchLeads=0,demandLeads=0,demandHasFollower=false,demandRowSpend=0;const eligibleRows=[];
 rows.forEach(r=>{const campaign=norm(pick(r,["campanha","campaign"])),status=norm(pick(r,["status da campanha","campaign status"])),type=norm(pick(r,["tipo de campanha","campaign type"])),source=norm(pick(r,["origem da conversao","conversion source"])),conv=numeric(pick(r,["conversoes","conversions","todas as conversoes","all conversions"]))||0,cost=numeric(pick(r,["custo","cost"]))||0,subs=numeric(pick(r,["assinantes adquiridos","subscribers gained","earned subscribers"]))||0,total=/^total/.test(`${status} ${campaign}`),follower=/seguidor|subscriber|inscrito|youtube|video|hospedada pelo youtube/.test(`${source} ${campaign} ${type}`),search=/pesquisa|search/.test(`${status} ${campaign} ${type}`),demand=/geracao de demanda|demand gen|demand generation/.test(`${status} ${campaign} ${type}`),site=!source||/site|website/.test(source);
  if(total&&/total conta/.test(status)&&!source&&cost>0)accountSpend=Math.max(accountSpend||0,cost);
  if(total&&search&&cost>0)searchTotal=Math.max(searchTotal||0,cost);
  if(total&&demand&&cost>0)demandTotal=Math.max(demandTotal||0,cost);
  if(!total){campaignSpend+=cost;if(demand&&follower)demandHasFollower=true;if((search||demand)&&site&&!follower){leads+=conv;found=true;eligibleRows.push({search,demand,cost});if(search)searchLeads+=conv;if(demand){demandLeads+=conv;demandRowSpend+=cost}}}
  if(subs>newSubscribers)newSubscribers=subs;
 });
 const searchRowSpend=eligibleRows.filter(row=>row.search).reduce((sum,row)=>sum+row.cost,0),searchSpend=searchLeads?searchTotal||searchRowSpend:0,demandSpend=demandLeads?(demandRowSpend||(!demandHasFollower?demandTotal:0)):0,spendComplete=(!searchLeads||searchSpend>0)&&(!demandLeads||demandSpend>0),eligibleSpend=searchSpend+demandSpend;
 return{leads:found?leads:null,cpl:found&&leads&&spendComplete?eligibleSpend/leads:null,spend:Number.isFinite(accountSpend)?accountSpend:(campaignSpend||null),newSubscribers:newSubscribers||null};
}
let editingPlatform="meta";
function metricOptionMarkup(def,checked){
 return`<div class="metric-option" data-key="${def.key}"><input id="metric-${def.key}" type="checkbox" ${checked?"checked":""}><label for="metric-${def.key}">${def.label}</label><button class="metric-order move-up" type="button" aria-label="Mover ${def.label} para cima" title="Mover para cima"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button><button class="metric-order move-down" type="button" aria-label="Mover ${def.label} para baixo" title="Mover para baixo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button></div>`;
}
function renderMetricEditor(keys){
 const catalog=metricCatalogFor(editingPlatform),ordered=[...keys,...catalog.map(m=>m.key).filter(k=>!keys.includes(k))];
 $("metric-options").innerHTML=ordered.map(k=>metricOptionMarkup(catalog.find(m=>m.key===k),keys.includes(k))).join("");
 $("metric-options").querySelectorAll(".move-up").forEach(button=>button.onclick=()=>{const row=button.closest(".metric-option"),before=row.previousElementSibling;if(before)row.parentNode.insertBefore(row,before)});
 $("metric-options").querySelectorAll(".move-down").forEach(button=>button.onclick=()=>{const row=button.closest(".metric-option"),after=row.nextElementSibling;if(after)row.parentNode.insertBefore(after,row)});
}
function openMetricEditor(platform){
 editingPlatform=platform;const c=clients[client],label=platform==="google"?"Google Ads":"Meta e Instagram",current=effectiveMetrics(platform).map(m=>m.key);
 $("metrics-title").textContent=`Indicadores · ${label}`;$("metrics-scope").textContent=`${c.name}: esta configuração valerá de ${active().date} em diante. As semanas anteriores não serão alteradas.`;$("metrics-feedback").textContent="";renderMetricEditor(current);$("metrics-dialog").showModal();
}
function saveMetricStrategy(event){
 event.preventDefault();const rows=[...$("metric-options").querySelectorAll(".metric-option")],keys=rows.filter(row=>row.querySelector("input").checked).map(row=>row.dataset.key);
 if(!keys.length){$("metrics-feedback").textContent="Mantenha pelo menos um indicador ativo.";return}
 const versions=metricVersions(editingPlatform).filter(v=>v.from<selected);versions.push({from:selected,keys});localStorage.setItem(key(`metric-versions-${editingPlatform}`),JSON.stringify(versions));window.performanceDb?.saveMetricStrategy(client,editingPlatform,selected,keys);$("metrics-dialog").close();render();
}
const localIsoDate=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
function validateReportDate(value,todayValue=localIsoDate(new Date())){const date=new Date(`${value}T12:00:00`);if(!value||Number.isNaN(date.getTime()))throw new Error("Informe uma data válida para o relatório.");if(value>todayValue)throw new Error("A data do relatório não pode estar no futuro.");return value}
function setupImport(){
 $("import-dialog").dataset.mode="weekly";document.querySelectorAll(".weekly-import-field").forEach(field=>field.hidden=false);$("history-import-panel").hidden=true;$("meta-csv").required=true;$("import-submit").textContent="Criar semana";
 const c=clients[client];$("google-upload-card").hidden=!c.google;$("google-csv").required=c.google;$("followers-field").hidden=!c.followers;$("new-followers-input").required=c.followers;$("new-followers-input").min="";$("import-title").textContent=`Importar semana · ${c.name}`;
 $("import-description").textContent=c.google?"Envie os relatórios do Meta e do Google. Cada objetivo será separado automaticamente.":"Envie o relatório do Meta. Cada objetivo será separado automaticamente.";
 $("import-tip").textContent=c.google?"Exporte no nível de campanhas. No Google, Pesquisa e Geração de Demanda com origem Site entram como leads; inscritos do YouTube ficam separados.":"Exporte no nível de campanhas. Formulários, mensagens e conversas de WhatsApp são separados e também consolidados como resultados.";
 const today=localIsoDate(new Date());$("import-date").value=today;$("import-date").max=today;
 ["meta-csv","google-csv"].forEach(id=>$(id).value="");$("new-followers-input").value="";$("meta-file-name").textContent=$("google-file-name").textContent="Selecionar relatório semanal";$("import-feedback").textContent=c.google?"Envie os CSVs no nível de campanha.":"Envie o CSV do Meta no nível de campanha.";
}
function setupHistoryImport(){
 const c=clients[client];historyImportPreview=null;$("import-dialog").dataset.mode="history";document.querySelectorAll(".weekly-import-field").forEach(field=>field.hidden=true);$("history-import-panel").hidden=false;$("meta-csv").required=false;$("google-csv").required=false;$("new-followers-input").required=false;$("import-title").textContent=`Importar histórico · ${c.name}`;$("import-description").textContent="Envie os relatórios diários disponíveis para consolidar as semanas passadas.";["history-meta-csv","history-google-daily-csv","history-google-conversions-csv"].forEach(id=>$(id).value="");$("history-meta-file-name").textContent="Selecionar CSV com o período completo";$("history-google-daily-file-name").textContent="Cliques e custo por dia";$("history-google-conversions-file-name").textContent="Dia, ação de conversão e conversões";$("history-preview").className="history-preview";$("history-preview").textContent="Selecione os CSVs para conferir as semanas identificadas antes de importar.";$("import-submit").textContent="Importar semanas";
}
async function refreshHistoricalPreview(){
 const preview=$("history-preview"),metaFile=$("history-meta-csv").files[0],googleDaily=$("history-google-daily-csv").files[0],googleConversions=$("history-google-conversions-csv").files[0];historyImportPreview=null;preview.className="history-preview";
 try{if(Boolean(googleDaily)!==Boolean(googleConversions)){preview.textContent="Para o Google, selecione os dois CSVs: diário e conversões.";return}if(!metaFile&&!googleDaily){preview.textContent="Selecione os CSVs para conferir as semanas identificadas antes de importar.";return}const meta=metaFile?historicalMetaPreview(csv(await metaFile.text())):[],google=googleDaily?historicalGooglePreview(csvWithHeaders(await googleDaily.text(),["dia","cliques","custo"]),csvWithHeaders(await googleConversions.text(),["dia","acao de conversao","conversoes"])):[],items=[...meta,...google],metrics=items.reduce((total,item)=>total+Object.keys(item.meta||item.google||{}).length,0),keys=[...new Set(items.map(item=>item.key))].sort(),first=keys.at(0),last=keys.at(-1);historyImportPreview={meta,google};preview.textContent=items.length?`Prévia pronta: ${keys.length} semanas e ${metrics} métricas ausentes identificadas, de ${first.split("-").reverse().join("/")} a ${last.split("-").reverse().join("/")}.`:"Nenhuma métrica ausente foi encontrada para este cliente."}catch(error){preview.textContent=`Não foi possível ler os CSVs: ${error.message}`;preview.className="history-preview error"}
}

// ✅ FUNÇÃO CORRIGIDA: importSubmit com tratamento apropriado de persistência
async function importSubmit(e){
 e.preventDefault();
 if($("import-dialog").dataset.mode==="history"){try{await importHistoricalCsv()}catch(error){$("history-preview").textContent=`Não foi possível importar: ${error.message}`;$("history-preview").className="history-preview error";console.error(error)}return}
 const c=clients[client];
 const mf=$("meta-csv").files[0];
 const gf=$("google-csv").files[0];

 if(!mf||c.google&&!gf){
  $("import-feedback").textContent="Selecione todos os relatórios necessários.";
  return;
 }

  try{
   const referenceValue=validateReportDate($("import-date").value);
   const meta=metaAggregate(csv(await mf.text()));
  const g=c.google?googleAggregate(csv(await gf.text())):null;
  const prev=active();
  const nf=numeric($("new-followers-input").value);

  if(c.followers){
   meta.newFollowers=nf;
   meta.followers=Number.isFinite(prev.meta?.followers)&&Number.isFinite(nf)?prev.meta.followers+nf:null
  }
  if(c.google&&c.youtube){
   g.subscribers=Number.isFinite(prev.google?.subscribers)&&Number.isFinite(g.newSubscribers)?prev.google.subscribers+g.newSubscribers:null
  }

  const item=W(referenceValue,meta,g,[]);item.source="csv";

  // Salva primeiro no navegador. A cópia local só é removida após confirmação real do Supabase.
  queueImported(item,client);
  clients[client].weeks=mergeWeek(clients[client].weeks,item);
  let persistedInDatabase=false;
  if(window.performanceDb?.ready){
   try{await window.performanceDb.saveWeek(client,item);markImportedSynced(item.key,client);persistedInDatabase=true}
   catch(dbError){console.error("Erro ao salvar no Supabase; semana mantida localmente:",dbError)}
  }

  selected=item.key;
  localStorage.setItem(selectedStorageKey(client),selected);
  loadWeeks();
  render();
  $("import-dialog").close();
  $("import-feedback").textContent=persistedInDatabase?"Semana importada e sincronizada com o Supabase.":"Semana importada e preservada neste navegador. A sincronização ocorrerá quando o banco estiver disponível.";

 }catch(err){
  $("import-feedback").textContent=`Não foi possível importar: ${err.message}`;
  console.error(err);
 }
}

$("client-select").onchange=e=>{const value=e.target.value;if(value==="__austral__")showOverview();else openClient(value)};
$("overview-open").onclick=showOverview;
$("creative-toggle").onclick=async()=>{const c=clients[client];c.showCreative=false;brand();try{await window.performanceDb?.saveClientDisplay(client,false)}catch(error){console.error(error);c.showCreative=true;brand()}};
$("creative-restore").onclick=async()=>{const c=clients[client];c.showCreative=true;brand();try{await window.performanceDb?.saveClientDisplay(client,true)}catch(error){console.error(error);c.showCreative=false;brand()}};
$("theme-toggle").onclick=()=>{applyColorMode(document.documentElement.dataset.theme==="dark"?"light":"dark",true);brand()};
if($("logout-open"))$("logout-open").onclick=()=>{if(confirm("Sair do painel?"))window.performanceDb?.signOut()};
$("week-select").onchange=e=>{selected=e.target.value;localStorage.setItem(selectedStorageKey(client),selected);render()};
$("period-week").onclick=()=>{periodMode="week";$("period-week").setAttribute("aria-pressed","true");$("period-month").setAttribute("aria-pressed","false");render()};
$("period-month").onclick=()=>{periodMode="month";$("period-week").setAttribute("aria-pressed","false");$("period-month").setAttribute("aria-pressed","true");render()};
$("quick-notes").oninput=e=>{localStorage.setItem(key(`notes-${selected}`),e.target.value);const cur=active();if(cur)cur.note=e.target.value;window.performanceDb?.saveNote(client,selected,e.target.value)};
$("quick-action-form").onsubmit=async e=>{e.preventDefault();const input=$("quick-action"),button=e.currentTarget.querySelector("button"),title=input.value.trim();if(!title||button.disabled)return;const targetClient=client,targetDate=selected,previousActions=actions.map(action=>({...action})),snapshot=[...previousActions,{title,meta:"Prazo a definir",done:false}];actions=snapshot;const cur=active();if(cur)cur.actions=snapshot.map(action=>({...action}));input.value="";button.disabled=true;renderActions(cur);try{const persisted=await saveActions(targetClient,targetDate,snapshot);if(client===targetClient&&selected===targetDate){actions=persisted.map(action=>({...action}));renderActions(active())}}catch{if(client===targetClient&&selected===targetDate){actions=previousActions;const current=active();if(current)current.actions=previousActions.map(action=>({...action}));input.value=title;renderActions(current);input.focus()}}finally{button.disabled=false}};
$("history-open").onclick=()=>{history();$("history-dialog").showModal()};$("history-close").onclick=()=>$("history-dialog").close();
$("client-new-open").onclick=openNewClient;["client-new-close","client-new-cancel"].forEach(id=>$(id).onclick=()=>$("client-new-dialog").close());$("client-new-form").onsubmit=saveNewClient;$("client-new-has-google").onchange=e=>{$("client-new-google-field").hidden=!e.target.checked};
$("client-new-name").oninput=e=>{const init=$("client-new-initials");if(!init.dataset.touched)init.value=suggestInitials(e.target.value)};$("client-new-initials").oninput=e=>{e.target.dataset.touched="1"};$("client-new-form").onreset=()=>{delete $("client-new-initials").dataset.touched};
$("strategy-close").onclick=()=>$("strategy-dialog").close();$("strategy-form").onsubmit=saveStrategyEntry;
$("budget-open").onclick=$("budget-open-mobile").onclick=openBudgetEditor;["budget-close","budget-cancel"].forEach(id=>$(id).onclick=()=>$("budget-dialog").close());$("budget-form").onsubmit=saveBudgets;
document.querySelectorAll(".metric-edit").forEach(button=>button.onclick=()=>openMetricEditor(button.dataset.platform));
$("metrics-close").onclick=$("metrics-cancel").onclick=()=>$("metrics-dialog").close();$("metrics-form").onsubmit=saveMetricStrategy;
$("metrics-default").onclick=()=>{renderMetricEditor(defaultMetrics(editingPlatform).map(m=>m.key));$("metrics-feedback").textContent="Padrão carregado. Clique em Salvar estratégia para aplicar."};
["metric-value-close","metric-value-cancel"].forEach(id=>$(id).onclick=()=>$("metric-value-dialog").close());$("metric-value-form").onsubmit=saveMetricValue;$("metric-value-clear").onclick=clearMetricValue;
$("import-open").onclick=()=>{setupImport();$("import-dialog").showModal()};$("history-import-open").onclick=()=>{setupHistoryImport();$("import-dialog").showModal()};["import-close","import-cancel"].forEach(id=>$(id).onclick=()=>$("import-dialog").close());$("import-form").onsubmit=importSubmit;
$("meta-csv").onchange=async e=>{const file=e.target.files[0];$("meta-file-name").textContent=file?.name||"Selecionar relatório semanal";if(!file)return;try{const data=metaAggregate(csv(await file.text())),parts=[];if(Number.isFinite(data.leads))parts.push(`${num(data.leads)} leads`);if(Number.isFinite(data.messages))parts.push(`${num(data.messages)} mensagens`);$("import-feedback").textContent=parts.length?`Meta identificado: ${parts.join(" e ")}.`:"Meta carregado. Nenhum resultado de formulário ou mensagem foi identificado."}catch(error){$("import-feedback").textContent=`Não foi possível ler o Meta: ${error.message}`}};
$("history-meta-csv").onchange=e=>{$("history-meta-file-name").textContent=e.target.files[0]?.name||"Selecionar CSV com o período completo";refreshHistoricalPreview()};$("history-google-daily-csv").onchange=e=>{$("history-google-daily-file-name").textContent=e.target.files[0]?.name||"Cliques e custo por dia";refreshHistoricalPreview()};$("history-google-conversions-csv").onchange=e=>{$("history-google-conversions-file-name").textContent=e.target.files[0]?.name||"Dia, ação de conversão e conversões";refreshHistoricalPreview()};
$("google-csv").onchange=async e=>{const file=e.target.files[0];$("google-file-name").textContent=file?.name||"Selecionar relatório semanal";if(!file)return;try{const data=googleAggregate(csv(await file.text()));$("import-feedback").textContent=`Google identificado: ${num(data.leads)} leads e ${brl(data.spend)} de investimento.${Number.isFinite(data.cpl)?` CPL ${brl(data.cpl)}.`:" O custo das campanhas de leads está misturado a outras conversões; o CPL ficará indisponível."}`}catch(error){$("import-feedback").textContent=`Não foi possível ler o Google: ${error.message}`}};
$("edit-ad-link").onclick=()=>{$("ad-link-form").hidden=false;$("ad-link-input").value=adLink();$("ad-link-input").focus()};
$("ad-link-form").onsubmit=async e=>{e.preventDefault();const value=$("ad-link-input").value.trim(),feedback=$("ad-link-feedback"),submit=e.currentTarget.querySelector("button[type='submit']");try{if(value)new URL(value)}catch{feedback.textContent="Cole um endereço completo e válido.";return}if(!selected){feedback.textContent="Selecione uma semana antes de salvar a peça.";return}localStorage.setItem(creativeKey("ad"),value);queueCreativeLink(selected,value);const cur=active();if(cur){cur.creative=cur.creative||{};cur.creative.instagram_url=value||null}renderCreative();if(!window.performanceDb?.ready){feedback.textContent="Link salvo neste navegador. Ele será enviado quando o banco reconectar.";return}submit.disabled=true;feedback.textContent="Salvando link…";try{await window.performanceDb.saveCreativeLink(client,selected,value);removePendingCreativeLink(selected);feedback.textContent="Link salvo no banco.";$("ad-link-form").hidden=true}catch(error){console.error("Não foi possível salvar o link da peça:",error);feedback.textContent=`O link ficou pendente: ${error.message||"erro ao salvar no banco"}. Tentaremos novamente ao reconectar.`}finally{submit.disabled=false}};
$("creative-upload").onchange=e=>{const file=e.target.files[0];if(!file)return;if(file.size>4500000){$("creative-status").textContent="A imagem deve ter menos de 4,5 MB.";return}window.performanceDb?.uploadCreative(client,selected,file).catch(()=>{$("creative-status").textContent="Não foi possível salvar a imagem no banco."});const reader=new FileReader();reader.onload=()=>{try{localStorage.setItem(creativeKey("creative"),reader.result);const cur=active();if(cur){cur.creative=cur.creative||{};cur.creative.signedUrl=reader.result}renderCreative()}catch{$("creative-status").textContent="A imagem é grande demais para este navegador."}};reader.readAsDataURL(file)};
$("clear-creative-image").onclick=()=>{localStorage.removeItem(creativeKey("creative"));const cur=active();if(cur?.creative)cur.creative.signedUrl=null;window.performanceDb?.clearCreativeImage(client,selected);renderCreative()};
$("remove-imported-week").onclick=async()=>{if(!confirm("Remover esta semana e todos os dados associados?"))return;if(window.performanceDb?.ready){await window.performanceDb.deleteWeek(client,selected);clients[client].weeks=clients[client].weeks.filter(x=>x.key!==selected)}removeImported(selected,client);selected="";localStorage.removeItem(selectedStorageKey(client));loadWeeks();render();$("import-dialog").close()};

applyColorMode(localStorage.getItem(themeStorageKey)||document.documentElement.dataset.theme);populate();loadWeeks();if(appView==="client")openClient(client);else showOverview();
