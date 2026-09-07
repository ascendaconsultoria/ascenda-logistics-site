(() => {
  const carousel = document.querySelector("[data-crm-carousel]");
  if (!carousel) return;
  let initialized = false;
  const initialize = () => {
    if (initialized) return;
    initialized = true;

    // Local showcase data. No screenshot, customer export or production API is used.
    const leads = [
      {
        company: "Indústria Aurora",
        person: "Marina Carvalho",
        role: "Gerência de logística",
        segment: "Indústria",
        route: "SP → PR",
        volume: "24 t / embarque",
        frequency: "Semanal",
        operation: "Carga fechada",
        score: 94,
        stage: 0,
      },
      {
        company: "Distribuidora Ipê",
        person: "Bruno Martins",
        role: "Diretoria",
        segment: "Distribuidor",
        route: "MG → SP",
        volume: "8 t / mês",
        frequency: "3 vezes / semana",
        operation: "Fracionado recorrente",
        score: 91,
        stage: 0,
      },
      {
        company: "Vértice Embalagens",
        person: "Clara Nogueira",
        role: "Coordenação logística",
        segment: "Indústria",
        route: "SP → SC",
        volume: "18 t / embarque",
        frequency: "Quinzenal",
        operation: "Carga fechada",
        score: 92,
        stage: 1,
      },
      {
        company: "Horizonte Atacado",
        person: "Diego Ferreira",
        role: "Sócio-diretor",
        segment: "Atacadista",
        route: "PR → RS",
        volume: "12 t / mês",
        frequency: "Semanal",
        operation: "Distribuição regional",
        score: 88,
        stage: 2,
      },
      {
        company: "Cedro Componentes",
        person: "Elisa Ramos",
        role: "Gerência de suprimentos",
        segment: "Indústria",
        route: "SP → Argentina",
        volume: "25 t / embarque",
        frequency: "Mensal",
        operation: "Mercosul",
        score: 96,
        stage: 3,
      },
      {
        company: "Lume Varejo",
        person: "Felipe Almeida",
        role: "Gerência de operações",
        segment: "Varejo",
        route: "Grande São Paulo",
        volume: "10 t / mês",
        frequency: "Diária",
        operation: "Last mile",
        score: 90,
        stage: 4,
      },
    ];
    const icons = {
      route: '<path d="M5 19V5h14M5 15l4 4-4 4M15 1l4 4-4 4"/>',
      truck:
        '<path d="M2 5h12v12H2zM14 9h4l4 5v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
      person:
        '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
      chart: '<path d="M3 3v18h18M7 16v-5M12 16V7M17 16V4"/>',
      money:
        '<circle cx="12" cy="12" r="9"/><path d="M15 8h-5a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H9M12 6v12"/>',
      trend: '<path d="m3 17 6-6 4 4 8-11M15 4h6v6"/>',
      eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
      calendar:
        '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 2v6M17 2v6M3 11h18M9 15l6 4M15 15l-6 4"/>',
      lost: '<circle cx="12" cy="12" r="9"/><path d="m6 6 12 12"/>',
    };
    const icon = (name) =>
      `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.chart}</svg>`;
    const screen = (id, name, content, index) =>
      `<section id="crm-screen-${id}" class="crm-demo" role="group" aria-roledescription="slide" aria-label="${index + 1} de 4: ${name}" ${index ? "hidden" : ""}>${content}</section>`;
    const leadsScreen = `<div class="crm-demo__screen-heading"><div><h3>Seus embarcadores, em detalhe</h3><p>Conheça a demanda e o contato responsável.</p></div></div>
    <div class="crm-demo__table-scroll" aria-label="Tabela de leads"><table class="crm-demo__table"><thead><tr><th>Empresa / segmento</th><th>Contato / cargo</th><th>Rota principal</th><th>Volume</th><th>Frequência</th><th>Operação</th></tr></thead><tbody>${leads.map((lead) => `<tr><td><strong>${lead.company}</strong><small>${lead.segment}</small></td><td>${lead.person}<small>${lead.role}</small></td><td>${lead.route}</td><td>${lead.volume}</td><td>${lead.frequency}</td><td><span class="crm-demo__operation">${lead.operation}</span></td></tr>`).join("")}</tbody></table></div>
    <div class="crm-demo__mobile-leads" aria-label="Leads qualificados">${leads.map((lead) => `<article><div><h4>${lead.company}</h4><p>${lead.person} · ${lead.role}</p></div><dl><div><dt>Rota</dt><dd>${lead.route}</dd></div><div><dt>Volume</dt><dd>${lead.volume}</dd></div><div><dt>Operação</dt><dd>${lead.operation}</dd></div></dl><span>${lead.score}% de aderência</span></article>`).join("")}</div>`;
    const stages = [
      "Novo lead",
      "Contato iniciado",
      "Qualificação",
      "Reunião agendada",
      "Negociação",
    ];
    const nextSteps = [
      "Iniciar contato",
      "Validar demanda",
      "Agendar reunião",
      "Realizar reunião",
      "Acompanhar proposta",
    ];
    const kanbanLead = (lead, stageIndex, showAdherence = true) =>
      `<article class="crm-demo__lead"><h4>${lead.company}</h4><p>${lead.person} · ${lead.role}</p><dl><div><dt>${icon("route")}Rota</dt><dd>${lead.route}</dd></div><div><dt>${icon("truck")}Operação</dt><dd>${lead.operation}</dd></div><div><dt>${icon("chart")}Volume</dt><dd>${lead.volume}</dd></div></dl>${showAdherence ? `<div class="crm-demo__lead-bottom"><span class="crm-demo__score">${lead.score}</span><span>Aderência<small>Perfil compatível</small></span></div>` : ""}<div class="crm-demo__next-step"><small>Próximo passo</small>${nextSteps[stageIndex]}</div></article>`;
    const kanbanScreen = `<div class="crm-demo__screen-heading"><div><h3>Cada oportunidade, no próximo passo</h3><p>Da entrada do lead à negociação, com contexto.</p></div></div>
    <div class="crm-demo__board" aria-label="Kanban demonstrativo">${stages
      .map(
        (stage, index) =>
          `<div class="crm-demo__column" data-stage="${index}"><div class="crm-demo__column-title"><span>${stage}</span><b>${Math.min(1, leads.filter((lead) => lead.stage === index).length)}</b></div>${leads
            .filter((lead) => lead.stage === index)
            .slice(0, 1)
            .map((lead) => kanbanLead(lead, index))
            .join("")}</div>`,
      )
      .join("")}</div>
    <div class="crm-demo__mobile-kanban" aria-label="Kanban mobile com novos leads"><div class="crm-demo__column" data-stage="0"><div class="crm-demo__column-title"><span>Novo lead</span><b>2</b></div>${leads
      .filter((lead) => lead.stage === 0)
      .slice(0, 2)
      .map((lead) => kanbanLead(lead, 0, false))
      .join("")}</div></div>`;
    const funnelStages = [...stages, "Ganho"];
    const counts = [48, 36, 24, 12, 8, 4];
    const funnelScreen = `<div class="crm-demo__screen-heading"><div><h3>Funil comercial</h3><p>Avanço acumulado das oportunidades em cada etapa.</p></div></div><div class="crm-demo__funnel-layout"><svg class="crm-demo__funnel" viewBox="0 0 380 310" role="img" aria-label="Funil com 48 leads recebidos e 4 ganhos">${counts
      .map((_count, i) => {
        const inset = i * 25;
        const y = i * 51;
        return `<path fill="${["#6146f4", "#7460ed", "#8877e7", "#9e90e3", "#b2a6e8", "#c8bfed"][i]}" d="M${inset} ${y}H${380 - inset}L${355 - inset} ${y + 48}H${25 + inset}Z"/>`;
      })
      .join(
        "",
      )}</svg><table class="crm-demo__funnel-table"><thead><tr><th>Etapa</th><th>Leads</th><th>% da entrada</th></tr></thead><tbody>${counts.map((count, i) => `<tr><td><i></i>${funnelStages[i]}</td><td>${count}</td><td>${((count / 48) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%</td></tr>`).join("")}</tbody></table><div class="crm-demo__outcomes"><article>${icon("calendar")}<span>Não compareceu</span><strong>2</strong><small>16,7% das 12 reuniões agendadas</small></article><article>${icon("lost")}<span>Perdido</span><strong>6</strong><small>12,5% dos 48 leads recebidos</small></article></div></div><p class="crm-demo__footnote">Valores cumulativos: um lead pode aparecer em mais de uma etapa do histórico. A largura das faixas representa o volume em cada etapa.</p>`;
    const metrics = [
      ["INVESTIMENTO", "R$ 2.400", "Mídia no período", "money"],
      ["IMPRESSÕES", "120.000", "Exibições dos anúncios", "chart"],
      ["FREQUÊNCIA ESTIMADA", "1,5", "Impressões ÷ alcance", "trend"],
      ["CTR", "2,0%", "2.400 cliques totais", "trend"],
      ["CPC", "R$ 1,00", "Investimento ÷ cliques", "money"],
      ["CPM", "R$ 20,00", "Custo por mil impressões", "chart"],
      ["CUSTO POR LEAD", "R$ 50,00", "Investimento ÷ 48 leads", "money"],
      ["LEADS RECEBIDOS", "48", "Contatos únicos recebidos", "person"],
      ["CAC DE MÍDIA", "R$ 600", "Investimento ÷ 4 ganhos", "person"],
      ["VENDAS ATRIBUÍDAS", "R$ 12.000", "4 oportunidades ganhas", "money"],
      ["ROAS", "5,0×", "Receita atribuída ÷ mídia", "trend"],
      ["ROI", "400%", "Receita líquida sobre a mídia", "money"],
      ["LEADS / DIA", "1,6", "Média em 30 dias", "chart"],
      ["ALCANCE", "80.000", "Pessoas únicas alcançadas", "eye"],
      ["CLIQUES NO LINK", "1.200", "1,0% das impressões", "trend"],
      ["CONVERSÃO COMERCIAL", "8,3%", "4 ganhos em 48 leads", "chart"],
    ];
    const insightsScreen = `<div class="crm-demo__screen-heading"><div><h3>Insights da aquisição</h3><p>Visibilidade da mídia ao acompanhamento comercial.</p></div></div><div class="crm-demo__metrics">${metrics.map(([label, value, detail, symbol]) => `<article><div>${icon(symbol)}<h4>${label}</h4></div><strong>${value}</strong><p>${detail}</p></article>`).join("")}</div>`;
    const names = ["Leads", "Kanban", "Funil comercial", "Insights"];
    carousel.querySelector("[data-crm-screens]").innerHTML = [
      screen("leads", names[0], leadsScreen, 0),
      screen("kanban", names[1], kanbanScreen, 1),
      screen("funnel", names[2], funnelScreen, 2),
      screen("insights", names[3], insightsScreen, 3),
    ].join("");

    const panels = [...carousel.querySelectorAll(".crm-demo")];
    const buttons = [...carousel.querySelectorAll("[data-crm-tab]")];
    const dots = [...document.querySelectorAll("[data-crm-dot]")];
    const pauseButton = document.querySelector("[data-crm-pause]");
    const stage = carousel.querySelector("[data-crm-screens]");
    buttons.forEach((button, index) => {
      button.setAttribute("aria-controls", panels[index].id);
    });
    dots.forEach((dot, index) => {
      dot.setAttribute("aria-controls", panels[index].id);
    });
    // A fixed composition scales like a static image, without nested scroll areas.
    const mobileLayout = matchMedia("(max-width: 600px)");
    const resize = () => {
      if (mobileLayout.matches) {
        stage.style.setProperty("--crm-scale", "1");
        stage.style.height = "500px";
        return;
      }
      const width = stage.clientWidth - 24;
      stage.style.setProperty("--crm-scale", String(width / 1188));
      stage.style.height = `${(368 * width) / 1188 + 24}px`;
    };
    resize();
    new ResizeObserver(resize).observe(stage);
    mobileLayout.addEventListener("change", resize);

    let index = 0;
    let paused = false;
    let inView = true;
    let timer;
    const syncPlayback = () => {
      clearInterval(timer);
      if (!paused && inView && !document.hidden && !mobileLayout.matches) {
        timer = setInterval(() => show(index + 1), 5000);
      }
      pauseButton.textContent = paused ? "Reproduzir" : "Pausar";
      pauseButton.setAttribute(
        "aria-label",
        paused
          ? "Reproduzir alternância automática"
          : "Pausar alternância automática",
      );
    };
    const show = (next, manual = false) => {
      index = (next + panels.length) % panels.length;
      panels.forEach((panel, i) => {
        panel.hidden = i !== index;
      });
      buttons.forEach((button, i) => {
        button.setAttribute("aria-pressed", String(i === index));
      });
      dots.forEach((dot, i) => {
        dot.setAttribute("aria-pressed", String(i === index));
      });
      if (manual) {
        carousel.querySelector("[data-crm-announcement]").textContent =
          `Tela ${index + 1} de 4: ${names[index]}`;
      }
      syncPlayback();
    };
    buttons.forEach((button, i) => {
      button.addEventListener("click", () => show(i, true));
    });
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => show(i, true));
    });
    pauseButton.addEventListener("click", () => {
      paused = !paused;
      syncPlayback();
    });
    document.addEventListener("visibilitychange", syncPlayback);
    mobileLayout.addEventListener("change", () => {
      if (mobileLayout.matches) show(1);
      else syncPlayback();
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          syncPlayback();
        },
        { rootMargin: "80px 0px", threshold: 0.01 },
      ).observe(carousel);
    } else {
      inView = true;
    }
    carousel.querySelector(".crm-showcase__navigation").hidden = false;
    document.querySelector("[data-crm-dots]").hidden = false;
    if (mobileLayout.matches) show(1);
    else syncPlayback();
  };

  if (location.hash === "#dados") {
    initialize();
  } else if ("IntersectionObserver" in window) {
    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        loadObserver.disconnect();
        initialize();
      },
      { rootMargin: "900px 0px", threshold: 0.01 },
    );
    loadObserver.observe(carousel);
  } else {
    setTimeout(initialize, 0);
  }
})();
