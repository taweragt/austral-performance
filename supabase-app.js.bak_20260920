(() => {
  const config = window.SUPABASE_CONFIG;
  const sdk = window.supabase;
  if (!config?.url || !config?.publishableKey || !sdk?.createClient) {
    console.error("Supabase não foi inicializado.");
    return;
  }

  const database = sdk.createClient(config.url, config.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  const weekIds = new Map();
  const metricVersionsByClient = new Map();
  let noteTimer = null;
  let currentUser = null;
  let currentRole = null;

  function authMarkup() {
    const root = document.createElement("section");
    root.id = "auth-gate";
    root.className = "auth-gate";
    root.innerHTML = `
      <div class="auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <span class="auth-kicker">TAIOM PERFORMANCE</span>
        <h1 id="auth-title">Acesso ao painel</h1>
        <p>Entre com e-mail e senha ou receba um link de acesso no seu e-mail.</p>
        <form id="auth-form">
          <label>E-mail<input id="auth-email" type="email" autocomplete="email" required></label>
          <label>Senha<input id="auth-password" type="password" autocomplete="current-password" minlength="8" required></label>
          <div class="auth-actions">
            <button id="auth-sign-in" class="auth-primary" type="submit">Entrar</button>
            <button id="auth-sign-up" type="button">Criar meu acesso</button>
            <button id="auth-magic-link" type="button">Receber link de acesso</button>
          </div>
          <button id="auth-forgot-password" type="button" class="auth-link">Esqueci minha senha</button>
          <p id="auth-feedback" class="auth-feedback" aria-live="polite"></p>
        </form>
      </div>`;
    document.body.append(root);
    return root;
  }

  function resetPasswordMarkup() {
    const root = document.createElement("section");
    root.id = "reset-gate";
    root.className = "auth-gate";
    root.hidden = true;
    root.innerHTML = `
      <div class="auth-card" role="dialog" aria-modal="true" aria-labelledby="reset-title">
        <span class="auth-kicker">TAIOM PERFORMANCE</span>
        <h1 id="reset-title">Definir nova senha</h1>
        <p>Escolha uma nova senha para acessar o painel.</p>
        <form id="reset-form">
          <label>Nova senha<input id="reset-password" type="password" autocomplete="new-password" minlength="8" required></label>
          <div class="auth-actions">
            <button class="auth-primary" type="submit">Salvar nova senha</button>
          </div>
          <p id="reset-feedback" class="auth-feedback" aria-live="polite"></p>
        </form>
      </div>`;
    document.body.append(root);
    return root;
  }

  function syncBadge() {
    const badge = document.createElement("div");
    badge.id = "database-status";
    badge.className = "database-status";
    badge.textContent = "Banco conectado";
    document.body.append(badge);
    return badge;
  }

  function accessMarkup() {
    const button = document.createElement("button");
    button.id = "access-open";
    button.className = "history-trigger access-trigger";
    button.type = "button";
    button.textContent = "Acessos";
    button.hidden = true;
    document.querySelector(".topbar-right")?.insertBefore(button, document.getElementById("theme-toggle"));
    const dialog = document.createElement("dialog");
    dialog.id = "access-dialog";
    dialog.className = "access-dialog";
    dialog.innerHTML = `<div class="access-head"><div><p class="overline">Segurança do painel</p><h2>Gerenciar acessos</h2><p>Convide pessoas pelo e-mail e remova acessos quando necessário.</p></div><button id="access-close" type="button" aria-label="Fechar gerenciamento de acessos"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><form id="access-invite-form" class="access-invite-form"><label for="access-email">E-mail da pessoa</label><div><input id="access-email" type="email" autocomplete="email" maxlength="254" required placeholder="nome@empresa.com"><button class="primary-button" type="submit">Enviar convite</button></div><p id="access-feedback" aria-live="polite"></p></form><div class="access-list" id="access-list"></div>`;
    document.body.append(dialog);
    return { button, dialog };
  }

  const authGate = authMarkup();
  const resetGate = resetPasswordMarkup();
  const statusBadge = syncBadge();
  const access = accessMarkup();
  const protectedContent = [...document.body.children].filter((element) => element !== authGate && element !== resetGate && element !== statusBadge);
  const feedback = document.getElementById("auth-feedback");
  const authForm = document.getElementById("auth-form");
  const signUpButton = document.getElementById("auth-sign-up");
  const magicLinkButton = document.getElementById("auth-magic-link");
  const forgotPasswordButton = document.getElementById("auth-forgot-password");
  const resetForm = document.getElementById("reset-form");

  function setAppLocked(locked) {
    protectedContent.forEach((element) => {
      element.inert = locked;
      if (locked) element.setAttribute("aria-hidden", "true");
      else element.removeAttribute("aria-hidden");
    });
  }

  setAppLocked(true);

  function setFeedback(message, kind = "") {
    feedback.textContent = message;
    feedback.dataset.kind = kind;
  }

  function setBusy(busy) {
    [...authForm.querySelectorAll("input, button")].forEach((element) => {
      element.disabled = busy;
    });
  }

  async function credentials() {
    return {
      email: document.getElementById("auth-email").value.trim(),
      password: document.getElementById("auth-password").value,
    };
  }

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setBusy(true);
    setFeedback("Entrando…");
    const { email, password } = await credentials();
    const { error } = await database.auth.signInWithPassword({ email, password });
    if (error) {
      setFeedback("Não foi possível entrar. Confira o e-mail, a senha e a confirmação recebida.", "error");
      setBusy(false);
      return;
    }
    setFeedback("Acesso confirmado.", "success");
  });

  signUpButton.addEventListener("click", async () => {
    if (!authForm.reportValidity()) return;
    setBusy(true);
    setFeedback("Criando seu acesso…");
    const { email, password } = await credentials();
    const { data, error } = await database.auth.signUp({ email, password });
    if (error) {
      setFeedback(error.message === "User already registered"
        ? "Este e-mail já possui acesso. Use o botão Entrar."
        : "Não foi possível criar o acesso. Tente novamente.", "error");
      setBusy(false);
      return;
    }
    if (!data.session) {
      setFeedback("Acesse seu e-mail, confirme o cadastro e depois volte para entrar.", "success");
      setBusy(false);
      return;
    }
    setFeedback("Acesso criado.", "success");
  });

  magicLinkButton.addEventListener("click", async () => {
    const emailInput = document.getElementById("auth-email");
    if (!emailInput.reportValidity()) return;
    setBusy(true);
    setFeedback("Enviando link de acesso…");
    const { error } = await database.auth.signInWithOtp({ email: emailInput.value.trim(), options: { shouldCreateUser: true, emailRedirectTo: `${location.origin}/` } });
    setFeedback(error ? "Não foi possível enviar o link. Tente novamente em alguns minutos." : "Link enviado. Confira também a caixa de spam.", error ? "error" : "success");
    setBusy(false);
  });

  forgotPasswordButton.addEventListener("click", async () => {
    const emailInput = document.getElementById("auth-email");
    if (!emailInput.reportValidity()) {
      setFeedback("Informe seu e-mail para receber o link de redefinição.", "error");
      return;
    }
    setBusy(true);
    setFeedback("Enviando link de redefinição de senha…");
    const { error } = await database.auth.resetPasswordForEmail(emailInput.value.trim(), { redirectTo: `${location.origin}/` });
    setFeedback(error ? "Não foi possível enviar o link de redefinição. Tente novamente em alguns minutos." : "Link de redefinição enviado. Confira seu e-mail (e a caixa de spam).", error ? "error" : "success");
    setBusy(false);
  });

  resetForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.getElementById("reset-password");
    const resetFeedback = document.getElementById("reset-feedback");
    const submit = resetForm.querySelector('[type="submit"]');
    submit.disabled = true;
    resetFeedback.textContent = "Salvando nova senha…";
    const { error } = await database.auth.updateUser({ password: input.value });
    if (error) {
      resetFeedback.textContent = "Não foi possível salvar a nova senha. Tente novamente.";
      submit.disabled = false;
      return;
    }
    resetFeedback.textContent = "Senha atualizada! Entrando no painel…";
    setTimeout(() => { resetGate.hidden = true; }, 900);
  });

  async function loadAccesses() {
    const [members, invitations] = await Promise.all([
      database.from("workspace_members").select("user_id,email,role,created_at").order("created_at"),
      database.from("workspace_invitations").select("email,status,created_at").order("created_at", { ascending: false }),
    ]);
    if (members.error || invitations.error) throw members.error || invitations.error;
    const invited = new Map(invitations.data.map((item) => [item.email, item]));
    const rows = members.data.map((member) => ({ ...member, status: member.role === "owner" ? "Proprietário" : "Ativo" }));
    invitations.data.filter((item) => !members.data.some((member) => member.email?.toLowerCase() === item.email)).forEach((item) => rows.push({ email: item.email, role: "invited", status: item.status === "revoked" ? "Revogado" : "Convite enviado" }));
    document.getElementById("access-list").innerHTML = rows.length ? rows.map((item) => `<div class="access-row"><span><strong>${item.email || "E-mail não informado"}</strong><small>${item.status}</small></span>${item.user_id && item.role !== "owner" ? `<button type="button" data-revoke="${item.user_id}">Remover</button>` : ""}</div>`).join("") : '<p class="access-empty">Nenhum acesso adicional cadastrado.</p>';
    document.querySelectorAll("[data-revoke]").forEach((button) => button.onclick = async () => {
      if (!confirm("Remover o acesso desta pessoa?")) return;
      button.disabled = true;
      const result = await database.rpc("revoke_workspace_member", { target_user_id: button.dataset.revoke });
      if (result.error) document.getElementById("access-feedback").textContent = "Não foi possível remover o acesso.";
      await loadAccesses();
    });
  }

  access.button.onclick = async () => { access.dialog.showModal(); document.getElementById("access-feedback").textContent = ""; try { await loadAccesses(); } catch { document.getElementById("access-feedback").textContent = "Não foi possível carregar os acessos."; } };
  document.getElementById("access-close").onclick = () => access.dialog.close();
  document.getElementById("access-invite-form").onsubmit = async (event) => {
    event.preventDefault();
    const input = document.getElementById("access-email"), submit = event.currentTarget.querySelector('[type="submit"]'), email = input.value.trim().toLowerCase(), message = document.getElementById("access-feedback");
    submit.disabled = true; message.textContent = "Preparando convite…";
    try {
      const permission = await database.rpc("invite_workspace_member", { target_email: email });
      if (permission.error) throw permission.error;
      const sent = await database.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: `${location.origin}/` } });
      if (sent.error) throw sent.error;
      message.textContent = "Convite enviado. A pessoa deve abrir o link recebido por e-mail."; input.value = ""; await loadAccesses();
    } catch (error) { console.error(error); message.textContent = "Não foi possível enviar o convite. Verifique o e-mail e tente novamente."; }
    finally { submit.disabled = false; }
  };

  const metricDefinition = (platform, key) => {
    const catalog = platform === "google" ? googleCatalog : metaCatalog;
    return catalog.find((metric) => metric.key === key) || M(key, key);
  };

  function mapWeeks(rows, metricRows, actionRows, creativeRows) {
    const metrics = new Map();
    metricRows.forEach((row) => {
      const current = metrics.get(row.week_id) || { meta: {}, google: {} };
      current[row.platform][row.metric_key] = Number(row.value);
      metrics.set(row.week_id, current);
    });

    const actionsByWeek = new Map();
    actionRows.forEach((row) => {
      const current = actionsByWeek.get(row.week_id) || [];
      current.push({ id: row.id, title: row.title, meta: row.details, done: row.done });
      actionsByWeek.set(row.week_id, current);
    });

    const creativesByWeek = new Map(creativeRows.map((row) => [row.week_id, row]));

    return rows.map((row) => {
      const values = metrics.get(row.id) || { meta: {}, google: {} };
      const creative = creativesByWeek.get(row.id);
      weekIds.set(`${row.client_id}:${row.reference_date}`, row.id);
      return {
        clientId: row.client_id,
        key: row.reference_date,
        date: row.reference_date.split("-").reverse().join("/"),
        period: row.period_start && row.period_end ? {
          start: row.period_start.split("-").reverse().join("/"),
          end: row.period_end.split("-").reverse().join("/"),
        } : undefined,
        meta: values.meta,
        google: Object.keys(values.google).length ? values.google : null,
        actions: actionsByWeek.get(row.id) || [],
        note: row.notes || "",
        creative: creative || null,
      };
    });
  }

  async function loadDatabase() {
    statusBadge.textContent = "Sincronizando…";
    statusBadge.dataset.state = "busy";

    const [clientResult, weekResult, metricResult, actionResult, strategyResult, creativeResult, campaignStrategyResult] = await Promise.all([
      database.from("clients").select("*").order("sort_order"),
      database.from("weeks").select("*").order("reference_date"),
      database.from("weekly_metrics").select("week_id,platform,metric_key,value"),
      database.from("actions").select("*").order("position"),
      database.from("metric_strategies").select("*").order("effective_from"),
      database.from("creatives").select("*"),
      database.from("campaign_strategies").select("*").order("created_at", { ascending: false }),
    ]);

    const failed = [clientResult, weekResult, metricResult, actionResult, strategyResult, creativeResult, campaignStrategyResult].find((result) => result.error);
    if (failed) throw failed.error;

    const campaignStrategiesByClient = new Map();
    (campaignStrategyResult.data || []).forEach((row) => {
      const current = campaignStrategiesByClient.get(row.client_id) || [];
      current.push(row);
      campaignStrategiesByClient.set(row.client_id, current);
    });

    const creativesWithUrls = await Promise.all(creativeResult.data.map(async (creative) => {
      if (!creative.storage_path) return creative;
      const signed = await database.storage.from("performance-creatives").createSignedUrl(creative.storage_path, 3600);
      return { ...creative, signedUrl: signed.data?.signedUrl || null };
    }));
    const mappedWeeks = mapWeeks(weekResult.data, metricResult.data, actionResult.data, creativesWithUrls);
    clientResult.data.forEach((row) => {
      const current = clients[row.id] || {};
      current.name = row.name;
      current.initials = row.initials;
      current.metaBudget = Number(row.meta_budget || 0);
      current.googleBudget = row.google_budget === null ? null : Number(row.google_budget);
      current.google = row.has_google;
      current.followers = row.tracks_followers;
      current.youtube = row.tracks_youtube;
      current.showCreative = row.show_creative !== false;
      current.metaMetrics = row.default_meta_metrics.map((key) => metricDefinition("meta", key));
      current.googleMetrics = row.default_google_metrics.map((key) => metricDefinition("google", key));
      current.weeks = mappedWeeks.filter((week) => week.clientId === row.id);
      current.strategies = campaignStrategiesByClient.get(row.id) || [];
      clients[row.id] = current;
    });

    metricVersionsByClient.clear();
    strategyResult.data.forEach((row) => {
      const mapKey = `${row.client_id}:${row.platform}`;
      const current = metricVersionsByClient.get(mapKey) || [];
      current.push({ from: row.effective_from, keys: row.metric_keys });
      metricVersionsByClient.set(mapKey, current);
    });

    window.performanceDb.ready = true;
    if (!clients[client]) client = Object.keys(clients)[0];
    selected = "";
    populate();
    loadWeeks();
    showOverview();
    statusBadge.textContent = "Banco conectado";
    statusBadge.dataset.state = "ok";
  }

  async function authorize(user) {
    const { data, error } = await database
      .from("workspace_members")
      .select("role,email")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data) {
      setAppLocked(true);
      authGate.hidden = false;
      statusBadge.hidden = true;
      setFeedback("Este usuário ainda não foi autorizado para o painel.", "error");
      setBusy(false);
      return;
    }

    currentUser = user;
    currentRole = data.role;
    window.accessControl = window.accessControl || {};
    window.accessControl.isOwner = currentRole === "owner";
    if (window.updateAccessButton) window.updateAccessButton(); else access.button.hidden = currentRole !== "owner";
    setAppLocked(false);
    authGate.hidden = true;
    resetGate.hidden = true;
    statusBadge.hidden = false;
    await loadDatabase();
  }

  async function withWeekId(clientId, referenceDate) {
    const existing = weekIds.get(`${clientId}:${referenceDate}`);
    if (existing) return existing;
    const { data, error } = await database.from("weeks")
      .select("id")
      .eq("client_id", clientId)
      .eq("reference_date", referenceDate)
      .single();
    if (error) throw error;
    weekIds.set(`${clientId}:${referenceDate}`, data.id);
    return data.id;
  }

  async function saveWeek(clientId, week) {
    statusBadge.textContent = "Salvando…";
    const periodStart = week.period?.start?.split("/").reverse().join("-") || null;
    const periodEnd = week.period?.end?.split("/").reverse().join("-") || null;
    const { data, error } = await database.from("weeks").upsert({
      client_id: clientId,
      reference_date: week.key,
      period_start: periodStart,
      period_end: periodEnd,
      source: week.period ? "csv" : "manual",
    }, { onConflict: "client_id,reference_date" }).select("id").single();
    if (error) throw error;
    weekIds.set(`${clientId}:${week.key}`, data.id);
    const rows = [];
    Object.entries(week.meta || {}).forEach(([metricKey, value]) => {
      if (Number.isFinite(value)) rows.push({ week_id: data.id, platform: "meta", metric_key: metricKey, value });
    });
    Object.entries(week.google || {}).forEach(([metricKey, value]) => {
      if (Number.isFinite(value)) rows.push({ week_id: data.id, platform: "google", metric_key: metricKey, value });
    });
    if (rows.length) {
      const result = await database.from("weekly_metrics").upsert(rows, { onConflict: "week_id,platform,metric_key" });
      if (result.error) throw result.error;
    }
    statusBadge.textContent = "Banco conectado";
  }

  window.performanceDb = {
    database,
    ready: false,
    metricVersions(clientId, platform) {
      return metricVersionsByClient.get(`${clientId}:${platform}`) || [];
    },
    async saveWeek(clientId, week) {
      try { await saveWeek(clientId, week); } catch (error) { console.error(error); statusBadge.textContent = "Erro ao salvar"; }
    },
    async saveBudgets(clientId, metaBudget, googleBudget) {
      statusBadge.textContent = "Salvando orçamento…";
      statusBadge.dataset.state = "busy";
      const result = await database.from("clients").update({
        meta_budget: metaBudget,
        google_budget: googleBudget,
      }).eq("id", clientId);
      if (result.error) {
        statusBadge.textContent = "Erro ao salvar";
        throw result.error;
      }
      statusBadge.textContent = "Banco conectado";
      statusBadge.dataset.state = "ok";
    },
    async saveClientDisplay(clientId, showCreative) {
      statusBadge.textContent = "Salvando preferência…";
      statusBadge.dataset.state = "busy";
      const result = await database.from("clients").update({ show_creative: showCreative }).eq("id", clientId);
      if (result.error) { statusBadge.textContent = "Erro ao salvar"; throw result.error; }
      statusBadge.textContent = "Banco conectado";
      statusBadge.dataset.state = "ok";
    },
    async saveActions(clientId, referenceDate, values) {
      try {
        const weekId = await withWeekId(clientId, referenceDate);
        await database.from("actions").delete().eq("week_id", weekId);
        if (values.length) {
          const result = await database.from("actions").insert(values.map((value, position) => ({
            week_id: weekId,
            title: value.title,
            details: value.meta || "",
            done: Boolean(value.done),
            position,
          })));
          if (result.error) throw result.error;
        }
      } catch (error) { console.error(error); statusBadge.textContent = "Erro ao salvar"; }
    },
    saveNote(clientId, referenceDate, notes) {
      clearTimeout(noteTimer);
      noteTimer = setTimeout(async () => {
        try {
          const weekId = await withWeekId(clientId, referenceDate);
          const result = await database.from("weeks").update({ notes }).eq("id", weekId);
          if (result.error) throw result.error;
        } catch (error) { console.error(error); statusBadge.textContent = "Erro ao salvar"; }
      }, 450);
    },
    async saveMetricStrategy(clientId, platform, effectiveFrom, keys) {
      const result = await database.from("metric_strategies").upsert({
        client_id: clientId,
        platform,
        effective_from: effectiveFrom,
        metric_keys: keys,
      }, { onConflict: "client_id,platform,effective_from" });
      if (!result.error) metricVersionsByClient.set(`${clientId}:${platform}`, [
        ...(metricVersionsByClient.get(`${clientId}:${platform}`) || []).filter((item) => item.from !== effectiveFrom),
        { from: effectiveFrom, keys },
      ]);
    },
    async saveCreativeLink(clientId, referenceDate, instagramUrl) {
      const weekId = await withWeekId(clientId, referenceDate);
      const existing = await database.from("creatives").select("storage_path").eq("week_id", weekId).maybeSingle();
      if (!instagramUrl && !existing.data?.storage_path) {
        await database.from("creatives").delete().eq("week_id", weekId);
        return;
      }
      await database.from("creatives").upsert({ week_id: weekId, instagram_url: instagramUrl || null, storage_path: existing.data?.storage_path || null }, { onConflict: "week_id" });
    },
    async uploadCreative(clientId, referenceDate, file) {
      const weekId = await withWeekId(clientId, referenceDate);
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${clientId}/${referenceDate}.${extension}`;
      const upload = await database.storage.from("performance-creatives").upload(path, file, { upsert: true, contentType: file.type });
      if (upload.error) throw upload.error;
      const existing = await database.from("creatives").select("instagram_url").eq("week_id", weekId).maybeSingle();
      await database.from("creatives").upsert({ week_id: weekId, instagram_url: existing.data?.instagram_url || null, storage_path: path }, { onConflict: "week_id" });
    },
    async clearCreativeImage(clientId, referenceDate) {
      const weekId = await withWeekId(clientId, referenceDate);
      const existing = await database.from("creatives").select("instagram_url,storage_path").eq("week_id", weekId).maybeSingle();
      if (existing.data?.storage_path) await database.storage.from("performance-creatives").remove([existing.data.storage_path]);
      if (existing.data?.instagram_url) {
        await database.from("creatives").update({ storage_path: null }).eq("week_id", weekId);
      } else {
        await database.from("creatives").delete().eq("week_id", weekId);
      }
    },
    async deleteWeek(clientId, referenceDate) {
      const weekId = await withWeekId(clientId, referenceDate);
      return database.from("weeks").delete().eq("id", weekId);
    },
    async saveStrategy(clientId, { docLink, rawText, campaigns, createdBy }) {
      statusBadge.textContent = "Salvando estratégia…";
      statusBadge.dataset.state = "busy";
      const { data, error } = await database.from("campaign_strategies").insert({
        client_id: clientId,
        doc_link: docLink || null,
        raw_text: rawText || "",
        campaigns: campaigns || [],
        created_by: createdBy || currentUser?.email || null,
      }).select("*").single();
      if (error) { statusBadge.textContent = "Erro ao salvar"; throw error; }
      statusBadge.textContent = "Banco conectado";
      statusBadge.dataset.state = "ok";
      return data;
    },
    async deleteStrategy(id) {
      const result = await database.from("campaign_strategies").delete().eq("id", id);
      if (result.error) throw result.error;
    },
    async signOut() {
      await database.auth.signOut();
    },
  };

  database.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      setAppLocked(true);
      authGate.hidden = true;
      resetGate.hidden = false;
      statusBadge.hidden = true;
      return;
    }
    if (session?.user) authorize(session.user).catch((error) => {
      console.error(error);
      setFeedback("Não foi possível carregar o painel.", "error");
    });
    else {
      window.performanceDb.ready = false;
      currentUser = null;
      currentRole = null;
      window.accessControl = window.accessControl || {};
      window.accessControl.isOwner = false;
      access.button.hidden = true;
      setAppLocked(true);
      authGate.hidden = false;
      resetGate.hidden = true;
      statusBadge.hidden = true;
      setBusy(false);
    }
  });

  database.auth.getSession().then(({ data }) => {
    if (data.session?.user) authorize(data.session.user);
    else {
      setAppLocked(true);
      authGate.hidden = false;
      statusBadge.hidden = true;
    }
  });
})();
