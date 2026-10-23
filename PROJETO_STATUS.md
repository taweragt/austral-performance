# Status do projeto

## Atualização — cadastro de novo cliente — 2026-10-23 (no ar)

- botão "+ Novo cliente" na Visão Geral (só aparece para o proprietário) abre formulário: nome, iniciais (sugeridas), cor da marca, modelo de métricas do Meta (Leads / Tráfego / Conversas), orçamentos, Google Ads, seguidores e YouTube;
- `window.performanceDb.createClient()` (supabase-app.js) insere em `clients` com `sort_order` seguinte e recarrega o banco; id = slug do nome (ex.: `descubra-turismo`), duplicado é recusado;
- cliente sem logo usa avatar com as iniciais na cor da marca (`themeFor()` / `brandMark()` em app.js); os 10 clientes antigos continuam com tema fixo;
- bug corrigido: `render()` saía antes de `brand()` quando o cliente não tinha semana — agora mostra estado vazio ("Sem semanas cadastradas") com a marca certa;
- migração `supabase/008_new_clients.sql` **aplicada no Supabase** em 2026-10-23: coluna `clients.brand_color` e política restritiva `owner_only_insert_clients` (só proprietário insere cliente);
- testes: persistence, report-date e historical-doc-data passam; `importers.test.mjs` falha por depender de CSVs em `Desktop - AUSTRAL\...` que não existem mais (não relacionado);
- validado em preview local com simulação do proprietário (login real não foi usado): card, seletor, orçamento total e página do cliente novo; **falta testar a criação real no banco com login**;
- logo do cliente novo: ainda não há upload; por enquanto só iniciais + cor;
- publicado: deploy `performance-b7zhsn8b2` (`vercel deploy --prod` + alias `performance-austral-app.vercel.app`), testado logado pelo usuário antes da troca; **backup para rollback**: `performance-de7l2y6q1` (versão de 05/10, `vercel alias set performance-de7l2y6q1-austral-app.vercel.app performance-austral-app.vercel.app`);
- backups `*.bak_20261023`; cache dos scripts `20261023-1`.

## Atualização — tarefas da semana sumindo e duplicando — 2026-10-05 (no ar)

- **bug**: tarefas da semana eram salvas na tabela `actions`, mas sumiam ao recarregar. Causa: `loadWeeks()`/`syncPendingImports()` mesclavam o cache local de CSV importado (`performance-v2-imported-*`) por cima da semana do banco, e a cópia do cache não tinha tarefas;
- **correção (app.js)**: com `performanceDb.ready`, a semana do banco prevalece e o cache só entra para datas ausentes no banco; importações pendentes atualizam métricas sem apagar ações, nota e peça (`mergeWeek` preserva esses campos);
- **correção (supabase-app.js, `saveActions`)**: update por UUID do banco, insert só de ações novas com `.select().single()`, id devolvido ao objeto da ação, `position` pelo índice, exclusão das ações removidas da lista (só ids conhecidos por este navegador) e fila por semana para cliques rápidos não duplicarem. Não usa a RPC `replace_week_actions`;
- testes: 2 casos novos em `tests/persistence.test.mjs` (falham na versão antiga, passam na nova); teste manual no preview logado: criar, concluir com cliques rápidos, recarregar, cache simulado, trocar de cliente e voltar — 1 linha no banco, concluída. Tarefa de teste apagada;
- publicado: commit `f3ba26f` no `main` (GitHub), deploy `performance-de7l2y6q1` com alias `performance-austral-app.vercel.app` (scripts `v=20261005-2`). **Atenção**: deploy disparado pelo push do GitHub não recebe o alias de produção; é preciso `vercel deploy --prod` + `vercel alias set <deploy> performance-austral-app.vercel.app`;
- Supabase Auth: Site URL alterado para `https://performance-austral-app.vercel.app` (antes apontava para `austral-performance.vercel.app`, versão antiga de 17/09 fora desta conta Vercel);
- preview local: `serve_preview.mjs` (porta 8767), configurado como `austral-preview` em `CLAUDE/.claude/launch.json`;
- pendente: `supabase/historical-doc-data.json` (métricas de clientes) não foi commitado porque o repositório é público — decidir antes de subir.

## Atualização — estratégia de campanha por cliente — 2026-09-19 (pendente de deploy)

- adicionado botão "+" (ícone de estratégia) em cada card de cliente na Visão Geral da Austral, sem interferir no clique que abre o cliente (`event.stopPropagation()`);
- abre o diálogo `#strategy-dialog`, onde é possível colar o link do doc (só como referência, não é lido automaticamente), o texto/CSV enviado pelo Wendell, ou uma anotação livre;
- `parseCampaignDoc()` em `app.js` interpreta o texto colado por regras (sem IA): reconhece "Campanha X", "LP", blocos "Meta Ads"/"Google Ads", "Orçamento:", "Público:", "Criativos:", lista de palavras-chave e "Título N:"/"Descrição N:" dos anúncios — tolerante a variações de acentuação/grafia (ex.: "Idéias de para anúncios"); testado com o doc real da campanha NR1/PER-DCOMP da RZ3;
- cada envio cria um novo registro no histórico (não substitui o anterior), exibido em cards por campanha com data e autor; cada registro pode ser removido individualmente;
- **não mexe no orçamento mensal do cliente** (`clients.meta_budget`/`google_budget`) — é um dado novo e paralelo, o orçamento aqui é por campanha/canal (ex.: "R$ 600/mês" da campanha, não o budget da conta);
- nova tabela `campaign_strategies` (migração `supabase/006_campaign_strategies.sql`), com a mesma política de RLS das demais tabelas (`workspace_members_all`); **pendente: rodar essa migração no SQL Editor do Supabase** — sem isso a tela abre normalmente, mas salvar retorna erro;
- `supabase-app.js` carrega as estratégias por cliente em `loadDatabase()` e expõe `saveStrategy`/`deleteStrategy` em `window.performanceDb`;
- validado com Playwright (Chromium headless) em desktop/dark/mobile: botão não navega para o cliente, parser extrai corretamente as duas campanhas do doc real, sem erros de console;
- **pendente: rodar a migração no Supabase e publicar no Vercel (`vercel --prod`)** para a função ficar disponível em produção.

## Atualização — topbar, Austral, período e domínio — 2026-09-19

- adicionada opção "Austral" no seletor de cliente, corrigindo bug em que a 4Medic não abria seus dados quando já estava selecionada (o `<select>` não disparava `change` ao reselecionar o mesmo valor);
- adicionado botão de logout no cabeçalho (`#logout-open`), chamando `signOut()`;
- adicionado seletor de período Semana/Mês (`#period-week` / `#period-month`) que agrega as semanas do mês exibido, incluindo média ponderada para métricas de custo/CPL e uso do último valor da semana para métricas cumulativas (seguidores/inscritos); a importação de CSV continua exclusivamente semanal;
- corrigido bug de CSS em que `[hidden]` era sobrescrito por regras com `display` explícito (ex.: `.budget-strip`), fazendo o orçamento aparecer indevidamente na Visão Geral; adicionada regra global `[hidden]{display:none!important}`;
- topbar reorganizado em uma única linha: à esquerda logo + Visão geral/Ver histórico; à direita, na Visão Geral, o seletor de Cliente ocupa o lugar do orçamento; ao selecionar um cliente, aparecem em sequência Orçamento+editar, Cliente, Semana, Semana/Mês, Importar semana, tema e sair;
- corrigida logo da Austral (badge circular com moinho e "Finalista do Prêmio Limitless 2025"), substituindo o placeholder;
- corrigido bug em `supabase-app.js`: `accessMarkup()` inseria o botão "Acessos" relativo a `.filters`, que deixou de conter `#theme-toggle` após a reestruturação do topbar; corrigido para inserir em `.topbar-right`;
- corrigido o card "Peça associada" (`#ad-empty`): ao remover o criativo pelo X, o card ocupava a altura inteira da coluna ao lado (herdada do CSS Grid `align-items: stretch` do `.overview-grid`); adicionado `align-self: start` condicional via `:has()` e reduzido o padding/min-height do estado vazio, deixando-o compacto;
- validado com Playwright (Chromium headless) em desktop/tablet/mobile, claro/escuro, sem erros de console;
- **domínio de produção corrigido**: `https://austral-performance.vercel.app` não pertence à conta Vercel usada neste projeto (`taweragt@gmail.com`) — confirmado com `vercel domains ls` (não lista esse domínio). Entradas anteriores deste arquivo (17/09) descreviam esse alias como concluído; isso não foi possível confirmar nem reproduzir em 19/09. A conta/sessão real usada para aquele alias não foi localizada, apesar de auditoria feita pelo Codex apontar (incorretamente) para esta mesma conta;
- deploy de produção executado com sucesso (`vercel --prod`) após instalar a Vercel CLI (`npm install -g vercel`) e autenticar como `taweragt@gmail.com`;
- time renomeado de `taiom-claude` para `austral-app` (nome de exibição "app performance"), a pedido do usuário, para não associar o painel da Austral ao nome pessoal do usuário nem à Vercel/Claude;
- projeto renomeado de `web-supabase-preview-v1` para `performance`;
- **endereço final de produção definido: `https://performance-austral-app.vercel.app`** — sem nome pessoal, sem "claude", confirmado no ar pelo usuário;
- durante a transição, o domínio `web-supabase-preview-v1.vercel.app` foi removido manualmente do projeto (para liberar o alias limpo) e passou a retornar 404 — comportamento esperado, não é mais o endereço usado.

## Estado atual

Painel Supabase implementado, autenticado, validado e publicado em um projeto próprio da Vercel. O fluxo simplificado de convites está em produção no endereço oficial.

## Convites simplificados — 2026-09-17

- proprietário ganhou o painel “Acessos” para convidar e remover pessoas;
- convidado recebe um link por e-mail e entra sem conta ou código da Vercel;
- novos usuários só recebem permissão quando existe convite pendente para o e-mail;
- funções e políticas do Supabase limitam convites e remoções ao proprietário;
- endereço oficial do Supabase Auth alterado para `https://austral-performance.vercel.app`;
- retorno permitido configurado como `https://austral-performance.vercel.app/**`;
- migração `supabase/004_workspace_invitations.sql` aplicada com sucesso no Supabase;
- painel validado localmente com o proprietário `taweragt@gmail.com` e papel “Proprietário”;
- prévia Vercel `dpl_3vCbxsAUSXzofvu4vFGgrad6tENA` criada com estado `READY`;
- URL da prévia: `https://web-supabase-preview-v1-edcinw6g0-taiom-claude.vercel.app`;
- resposta HTML autenticada pela CLI confirmada e console da prévia sem erros ou avisos;
- tela de acesso validada visualmente no desktop e gerenciamento de acessos validado em 390 × 844;
- prévia aprovada pelo usuário e promovida para produção no deploy `dpl_4N7fhbWnFEnLBVPTtT8Q61LYbr3a`;
- alias `https://austral-performance.vercel.app` apontado para a nova produção;
- publicação conferida autenticada: estado “Banco conectado”, botão “Acessos” e proprietário carregados corretamente;
- console da produção sem erros ou avisos após a promoção.

## Publicação na Vercel — 2026-09-17

- projeto criado: `taiom-claude/web-supabase-preview-v1`;
- deploy `dpl_DQidgt8rWGRxkNzqiZPH4uyDcGa9` concluído com estado `READY`;
- domínio principal: `https://web-supabase-preview-v1.vercel.app`;
- por ser o primeiro deploy do projeto novo, a Vercel atribuiu automaticamente o alvo `production`; nenhuma produção anterior foi substituída;
- Deployment Protection ativo e resposta HTTP 200 confirmada por acesso autenticado;
- HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e `X-Frame-Options` confirmados na resposta;
- tela de autenticação validada visualmente em 1280 × 900 e 390 × 844, sem rolagem horizontal ou sobreposição de erro;
- backups, documentação interna, servidor local e arquivos SQL excluídos do pacote por `.vercelignore`;
- nenhum usuário, senha ou dado do Supabase foi alterado durante a validação pública.
- validação autenticada concluída após entrada do usuário: estado `BANCO CONECTADO`, 10 clientes, 7 semanas da 4Medic e dados de 14/09/2026 carregados corretamente;
- logo, métricas, orçamento, filtros, histórico, importação e alternância de tema aparecem no domínio da Vercel sem rolagem horizontal ou sobreposição de erro.
- alias amigável `https://austral-performance.vercel.app` associado com sucesso ao mesmo deploy;
- novo endereço validado com HTTPS e resposta HTTP 200; domínio técnico anterior permanece disponível como alternativa.
- Deployment Protection alterada para `Standard Protection` (`prod_deployment_urls_and_all_previews`): `austral-performance.vercel.app` abre diretamente no login do painel sem conta Vercel;
- teste anônimo confirmado; a URL técnica única do deploy continua redirecionando para a autenticação da Vercel.

## Tema claro e escuro — 2026-09-17

- botão compacto de sol adicionado ao cabeçalho;
- modo escuro usa superfícies grafite azuladas, sem preto puro, e preserva as cores de cada cliente;
- preferência salva no navegador e reaplicada antes da renderização da página;
- backups `app.js.bak_20260917_02`, `index.html.bak_20260917_02` e `styles.css.bak_20260917_02` criados antes da alteração;
- alternância e persistência confirmadas após recarregar a página;
- desktop validado em 1280 × 900 e celular em 390 × 844, sem rolagem horizontal;
- modo escuro verificado com 4Medic e 6HM, incluindo contraste especial para marcas de base preta;
- formulário de orçamento verificado no modo escuro e navegador sem sobreposição de erro.

## Enquadramento das logos — 2026-09-17

- escala e posição configuradas individualmente para as 10 marcas, sem alterar os arquivos originais;
- imagens quadradas de perfil agora usam recorte central controlado, sem deformação;
- Trilha Radical, 6HM e OralWave receberam ampliação adicional por terem mais espaço vazio interno;
- todas as logos conferidas visualmente no cabeçalho em modo escuro;
- backups `app.js.bak_20260917_03`, `styles.css.bak_20260917_03` e `PROJETO_STATUS.md.bak_20260917_03` criados antes da alteração.
- correção posterior: 6HM passou a usar enquadramento integral (`contain`) sem ampliação, eliminando o corte do nome; validada em desktop e celular.
- Ethos e Trilha Radical também passaram a usar enquadramento integral sem zoom; ambas validadas visualmente no desktop.
- solução final aprovada conceitualmente: recipiente da marca alterado de retangular para avatar circular, seguindo o formato das fotos de perfil do Instagram;
- zooms e ajustes individuais deixaram de ser aplicados na renderização; todas as 10 imagens usam recorte central uniforme dentro do círculo;
- avatares validados com 46 × 46 px no desktop e 36 × 36 px no celular, sem rolagem horizontal.

## Personalização por cliente e orçamento — 2026-09-17

- logos oficiais aplicadas aos 10 clientes: 4Medic, Ethos, Harmonia, Muniz Incorporadora, RZ3, Extra Ajuda, Trilha Radical, 6HM, Rooah e OralWave;
- cada cliente recebeu uma paleta própria aplicada ao cabeçalho, botões, controles e detalhes de destaque;
- cards de métricas permaneceram neutros para preservar contraste e legibilidade;
- orçamento mensal de Meta e Google agora pode ser editado pelo cabeçalho no desktop e pelo botão dedicado no celular;
- valores são gravados diretamente nos campos `meta_budget` e `google_budget` do cliente no Supabase;
- salvamento testado com valores temporários, persistência confirmada após recarregar e valores originais restaurados;
- as nove novas imagens somam aproximadamente 388 KB;
- desktop validado em 1280 × 900 e celular em 390 × 844 sem rolagem horizontal;
- todas as logos carregaram, o estado `BANCO CONECTADO` permaneceu ativo e o navegador não registrou erros ou avisos;
- backups `app.js.bak_20260917`, `index.html.bak_20260917`, `styles.css.bak_20260917` e `supabase-app.js.bak_20260917` criados antes das alterações;
- versão original e produção continuam preservadas; nenhuma publicação na Vercel foi realizada.

## Validação final — 2026-09-17

- backup `supabase-app.js.bak_20260916` criado antes da validação;
- sintaxe de `app.js`, `supabase-app.js` e `supabase-config.js` confirmada com `node --check`;
- preview iniciado em `http://127.0.0.1:8767/` e conexão autenticada confirmada pelo estado `BANCO CONECTADO`;
- 10 clientes carregados e troca entre clientes e semanas testada;
- correção do vínculo de semanas confirmada na mesma data de 31/08/2026: Ethos exibiu 31 leads no Google e 4Medic exibiu 53, sem mistura de registros;
- gravação reversível de anotação testada: o valor temporário persistiu após recarregar e foi removido, restaurando o valor original;
- desktop validado em 1280 × 900 e celular em 390 × 844, ambos sem rolagem horizontal;
- navegador sem erros, avisos ou sobreposição de erro;
- nenhuma publicação na Vercel ou troca de produção foi realizada.

## Atualização — Supabase em 2026-09-16

- projeto `Taiom-austral`, na região de São Paulo, configurado;
- 7 tabelas criadas: membros, clientes, semanas, métricas, ações, estratégias e criativos;
- RLS confirmado nas 7 tabelas e 8 políticas verificadas por consulta SQL;
- bucket privado `performance-creatives` criado com limite de 5 MB;
- 10 clientes, 57 semanas, 285 métricas e 7 ações importados;
- autenticação por e-mail e senha adicionada ao preview;
- primeiro usuário criado no Auth será o único proprietário inicial do workspace;
- URL e chave publicável conectadas; nenhuma chave secreta foi colocada no código;
- histórico de desempenho removido do JavaScript público e carregado somente após autenticação;
- conteúdo do painel fica inerte e oculto para leitores de tela antes da autenticação;
- vínculo de semanas corrigido para usar o cliente de origem, evitando mistura em datas iguais;
- sintaxe dos três arquivos JavaScript validada com `node --check`;
- tela de acesso conferida visualmente em desktop e em 390 × 844;
- navegador sem erros ou avisos de console;
- original `web-preview-v2` preservado e backup `web-preview-v2.bak_20260915` mantido;
- publicação na Vercel e troca de produção ainda não executadas.

## Escopo

- resumo geral da situação da conta;
- comparação direta dos principais números;
- Meta/Instagram e Google Ads lado a lado;
- próximas ações com checklist;
- anotação rápida persistida no navegador;
- anúncio da semana preservado.

## Próxima etapa

Usar o painel normalmente e cadastrar os supervisores pelo botão “Acessos”.

## Verificação realizada em 2026-09-14

- JavaScript validado sem erro de sintaxe;
- página carregada com conteúdo e sem erros no console;
- resumo completo encaixado em 1280 × 900, sem rolagem horizontal;
- celular validado em 375 × 812, sem rolagem horizontal;
- troca de semana validada com os valores da semana-base;
- checklist e inclusão de ação rápida testados;
- Modelo 1 preservado sem alterações.

## Atualização — link do criativo

- editor de link adicionado ao bloco “Anúncio da semana”;
- link salvo separadamente para cada semana no navegador;
- post `instagram.com/p/Dc3CrOSj3Qd` configurado como exemplo na semana atual;
- miniatura, URL e botão de abertura usam o link salvo;
- estado sem link validado na semana anterior;
- funcionamento conferido em desktop e celular, sem erros no console;
- backups `*.bak_20260914` criados antes da alteração.

## Atualização — prévia real do criativo

- publicação pública do Instagram incorporada pelo link salvo;
- post `Dc3CrOSj3Qd` carregado e conferido visualmente;
- imagem real exibida dentro do bloco “Anúncio da semana”;
- botão de envio de print adicionado como alternativa por semana;
- arquivos PNG, JPG e WebP de até 3 MB são aceitos;
- print salvo localmente pode ser removido para retornar à incorporação;
- desktop 1280 × 900 e celular 375 × 812 validados sem rolagem horizontal;
- página completa permanece em uma tela no desktop;
- backups `*.bak_20260914_03` criados antes da alteração.

## Correção — imagem cortada no embed

- captura do usuário analisada e recorte reproduzido;
- mídia do Instagram medida em 300 × 375, proporção 4:5;
- causa identificada: ausência das classes CSS no `iframe` e na imagem manual, fazendo o navegador usar aproximadamente 150 px de altura;
- classes corrigidas e visor ajustado para a proporção 4:5 mais o cabeçalho do Instagram;
- informações redundantes de campanha, plataforma e status removidas para preservar a tela compacta;
- imagem completa validada em desktop e celular;
- página continua cabendo em 1280 × 900 e permanece sem rolagem horizontal;
- backups `*.bak_20260914_04` criados antes da correção.

## Atualização — histórico real e comparações

- seis registros do documento carregados, de 03/08/2026 a 07/09/2026;
- seletor troca métricas, diagnóstico, ações, notas e criativo da semana;
- toda porcentagem usa a semana imediatamente anterior como referência;
- primeiro registro exibe “sem comparação” em vez de percentual artificial;
- leads do Meta incluídos como indicador principal;
- Google atualizado para 49 leads e CPL de R$ 19,36 em 07/09;
- orçamentos mensais visíveis no topo: Meta R$ 2 mil e Google R$ 4,5 mil;
- painel “Ver histórico” reúne os seis registros e destaca a semana selecionada;
- repetição de inscritos em 31/08 e 07/09 sinalizada para validação;
- ações e anotações agora são persistidas separadamente por semana;
- compatibilidade mantida com o link e o print do criativo já salvos;
- JavaScript validado, HTTP 200 confirmado e console sem erros;
- troca para 24/08 e semana-base de 03/08 testadas no navegador;
- interface conferida visualmente em desktop e tela compacta;
- backups `*.bak_20260914_05` criados antes da alteração.

## Atualização — logo oficial

- logo branca oficial obtida do site `4medic.com.br` e salva localmente como `logo-4medic-white.png`;
- marca aplicada em cápsula azul no cabeçalho, substituindo o símbolo provisório “4”;
- proporções ajustadas para desktop e tela compacta;
- imagem servida com HTTP 200 e página validada visualmente sem erros no console;
- backups `index.html.bak_20260915` e `styles.css.bak_20260915` criados antes da alteração.

## Ajuste — símbolo 4M enviado pelo usuário

- logo horizontal substituída pelo arquivo quadrado “4M” fornecido pelo usuário;
- arquivo salvo como `logo-4medic-square.jpg`;
- nome 4Medic e subtítulo mantidos ao lado no desktop;
- no layout compacto, o símbolo ocupa 34 × 34 px sem provocar rolagem horizontal;
- imagem confirmada com HTTP 200 e console sem erros;
- backups `*.bak_20260915_02` criados antes do ajuste.

## Ajuste — novos seguidores sem percentual

- percentual de “Novos seguidores” removido da visão semanal;
- indicador agora mostra somente seta verde para crescimento, vermelha para queda e traço na semana-base;
- percentual de crescimento mantido exclusivamente sobre o total de seguidores;
- estados de alta, queda e ausência de comparação testados no seletor;
- cache do JavaScript versionado para garantir atualização imediata no navegador.

## Correção — persistência das importações em 2026-09-20

- corrigido `window.performanceDb.saveWeek()`, que capturava falhas do Supabase sem repassar o erro ao importador;
- importações agora são salvas primeiro no `localStorage` e funcionam como fila pendente de sincronização;
- `loadWeeks()` passa a combinar sempre as semanas do banco com pendências locais, inclusive quando `performanceDb.ready` está ativo;
- semanas locais são removidas somente depois de confirmação real do Supabase;
- pendências são sincronizadas automaticamente após o carregamento do banco;
- chaves locais são deduplicadas por cliente e data para evitar semanas repetidas;
- cache de `app.js` e `supabase-app.js` atualizado para `20260920-1`;
- teste automatizado `tests/persistence.test.mjs` validou retenção offline, exibição após recarga e limpeza após sincronização;
- importadores de Google e Meta e sintaxe dos scripts continuaram aprovados;
- backups `app.js.bak_20260920`, `supabase-app.js.bak_20260920`, `index.html.bak_20260920`, `INDEX.md.bak_20260920` e `PROJETO_STATUS.md.bak_20260920` preservados;
- alteração validada apenas localmente; ainda não publicada na Vercel.

## Correção — navegação e datas em 2026-09-20

- tela atual, cliente e semana selecionada agora são preservados no `localStorage`;
- carregamento inicial e sincronização do Supabase restauram a visão anterior em vez de forçar o dashboard Austral;
- importação deixou de avançar sete dias a partir da última semana, comportamento que criava registros futuros em sequência;
- formulário usa a semana atual como padrão e bloqueia datas futuras;
- validação impede início posterior ao fim, intervalo superior a sete dias e reunião fora do período;
- cache dos scripts atualizado para `20260920-2`;
- testes de persistência, datas, Google e Meta aprovados;
- pasta religada ao projeto Vercel renomeado `austral-app/performance`;
- prévia `dpl_DmgzB7P1Bg2HFBxR1JhXpmsxwPmy` criada com estado `READY`;
- URL da prévia: `https://performance-gnf9ss591-austral-app.vercel.app`;
- prévia protegida pela autenticação da Vercel; produção não foi alterada;
- nenhuma semana antiga ou incorreta foi excluída.

## Correção — cache permanente e data única em 2026-09-21

- confirmada a diferença entre navegação interna e recarga completa: a semana permanecia apenas na memória enquanto o usuário alternava clientes;
- cache local e fila de sincronização foram separados;
- sucesso do Supabase agora limpa somente a pendência, preservando a cópia local usada na recarga;
- cache é combinado com os dados do Supabase por cliente e data, sem duplicação;
- teste automatizado reproduz importação, sucesso do banco e nova sessão carregando a semana do cache;
- campos “Data da reunião”, “Início do período” e “Fim do período” foram substituídos por “Data do relatório”;
- seletor de semanas mostra somente uma data por registro;
- novos registros CSV usam `source: csv` mesmo sem intervalo de período;
- datas futuras continuam bloqueadas;
- cache dos scripts atualizado para `20260921-1`;
- prévia Vercel `dpl_2k2kQtc96mhZ9WaMihmZbhvgCucA` criada com estado `READY`;
- URL da prévia: `https://performance-asvfobxtg-austral-app.vercel.app`;
- produção não foi alterada e nenhuma semana antiga foi excluída.

## Implementação — edição individual de métricas em 2026-09-21

- preservado o lápis do cabeçalho para configurar quais métricas aparecem na análise;
- incluído um lápis discreto em cada linha da visão semanal;
- criado formulário acessível com contexto do cliente, data e plataforma;
- valores aceitam vírgula ou ponto, são validados como números não negativos e podem ser limpos;
- criado `saveMetricValue()` no conector Supabase para atualizar ou excluir somente a métrica selecionada;
- implementada fila local independente para correções individuais, incluindo exclusões, com nova tentativa após reconexão;
- cópia local da semana é preservada para manter a correção depois de recarregar a página;
- edição direta fica desativada no consolidado mensal, evitando alteração ambígua de uma soma ou média;
- cache de interface atualizado para `20260921-2`;
- testes de persistência, importadores e data única aprovados;
- conferência visual local realizada em tela desktop com os controles por linha e o formulário de edição;
- backups `*.bak_20260921_02` criados antes da alteração;
- autorização da Vercel renovada pelo usuário na conta `taweragt-4638`;
- preview Vercel `dpl_1p5Y2qYQ4nNmrPg3xs57xYACxHct` criado com estado `READY`;
- URL do preview: `https://performance-8sk3zwfzf-austral-app.vercel.app`;
- o preview está protegido pela autenticação de desenvolvimento da Vercel; a interface autenticada foi validada localmente;
- produção não foi alterada.
