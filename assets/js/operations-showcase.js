(() => {
  const root = document.querySelector(".operations-showcase");
  if (!root) return;

  const primary = [
    [
      "Carga fechada",
      "Lotação, truck, carreta e projetos de maior volume por embarque.",
      "/assets/img/operations/carga-fechada.png",
    ],
    [
      "Fracionado recorrente",
      "Demandas frequentes, com volume mínimo, região e periodicidade definidos.",
      "/assets/img/operations/fracionado-recorrente.png",
    ],
    [
      "Ocupação de rotas",
      "Captação por origem, destino e oportunidades de ida e retorno.",
      "/assets/img/operations/ocupacao-rotas.png",
    ],
    [
      "Operações Mercosul",
      "Captação para fluxos internacionais compatíveis com a cobertura da transportadora.",
      "/assets/img/operations/operacoes-mercosul.png",
    ],
    [
      "Distribuição e last mile",
      "E-commerce, varejo e entregas distribuídas em rotas regionais ou urbanas.",
      "/assets/img/operations/distribuicao-last-mile.png",
    ],
    [
      "Armazenagem e distribuição",
      "Operações combinadas conforme capacidade, giro e cobertura regional.",
      "/assets/img/operations/armazenagem-distribuicao.png",
    ],
  ];
  const specialties = [
    [
      "Refrigerado e congelado",
      "Alimentos, bebidas e produtos que exigem controle de temperatura.",
      "/assets/img/operations/refrigerado-congelado.png",
    ],
    [
      "Químicos e produtos perigosos",
      "Cargas com exigências regulatórias e alto nível de segurança.",
      "/assets/img/operations/quimicos-perigosos.png",
    ],
    [
      "Farmacêutico e saúde",
      "Medicamentos, vacinas e insumos com rastreabilidade e controle rigoroso.",
      "/assets/img/operations/farmaceutico-saude.png",
    ],
    [
      "Contêineres e portuário",
      "Captação para operações de importação, exportação e movimentação de contêineres.",
      "/assets/img/operations/conteineres-portuario.png",
    ],
    [
      "Cargas especiais e projeto",
      "Equipamentos de grande porte e operações sob medida.",
      "/assets/img/operations/cargas-especiais-projeto.png",
    ],
    [
      "Cargas de alto valor",
      "Operações com maior nível de segurança, controle e rastreabilidade.",
      "/assets/img/operations/cargas-alto-valor.png",
    ],
  ];
  const rows = [...root.querySelectorAll("[data-ops-row]")];

  const card = ([title, description, image]) => {
    const webp = image.replace(/\.png$/i, ".webp");
    return `<article class="operations-showcase__card" style="--ops-image:url('${webp}');--ops-image-fallback:url('${image}')"><div class="operations-showcase__card-content"><h3>${title}</h3><p>${description}</p></div></article>`;
  };

  const visibleCards = () => (innerWidth < 620 ? 1 : innerWidth < 980 ? 2 : 3);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const usesTouchLayout = () => innerWidth <= 620;

  const syncNextButton = (row) => {
    const viewport = row.querySelector(".operations-showcase__viewport");
    const nextButton = row.querySelector("[data-ops-next]");
    if (!viewport || !nextButton) return;
    const isScrollable = viewport.scrollWidth > viewport.clientWidth + 4;
    const isAtEnd =
      viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 4;
    nextButton.hidden = !usesTouchLayout() || !isScrollable || isAtEnd;
  };

  const renderRow = (row, items) => {
    const visible = visibleCards();
    const direction = row.dataset.opsDirection === "ltr" ? "ltr" : "rtl";
    const markup = items.map((item) => card(item)).join("");
    const track = row.querySelector("[data-ops-track]");
    const viewport = row.querySelector(".operations-showcase__viewport");
    delete row.dataset.opsMode;
    track.innerHTML = usesTouchLayout() ? markup : markup.repeat(3);
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const cardWidth = (viewport.clientWidth - gap * (visible - 1)) / visible;
    if (usesTouchLayout()) {
      row.dataset.opsMode = "scroll";
      track.style.removeProperty("--ops-loop-from");
      track.style.removeProperty("--ops-loop-to");
      track.style.setProperty("--ops-card-width", `${cardWidth}px`);
      viewport.scrollLeft = 0;
      requestAnimationFrame(() => syncNextButton(row));
      return;
    }
    row.dataset.opsMode = "loop";
    const loopDistance = items.length * (cardWidth + gap);
    track.style.setProperty("--ops-card-width", `${cardWidth}px`);
    track.style.setProperty(
      "--ops-loop-from",
      `${direction === "rtl" ? -loopDistance : -loopDistance * 2}px`,
    );
    track.style.setProperty(
      "--ops-loop-to",
      `${direction === "rtl" ? -loopDistance * 2 : -loopDistance}px`,
    );
    void track.offsetWidth;
    row.dataset.opsMode = "loop";
    syncNextButton(row);
  };

  const render = () => {
    rows.forEach((row, index) => {
      renderRow(row, index ? specialties : primary);
    });
  };

  let resizeTimer;
  let initialized = false;
  const initialize = () => {
    if (initialized) return;
    initialized = true;
    rows.forEach((row) => {
      const viewport = row.querySelector(".operations-showcase__viewport");
      const track = row.querySelector("[data-ops-track]");
      const nextButton = row.querySelector("[data-ops-next]");
      if (!viewport || !track || !nextButton) return;
      nextButton.addEventListener("click", () => {
        const firstCard = row.querySelector(".operations-showcase__card");
        const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
        const distance = firstCard
          ? firstCard.getBoundingClientRect().width + gap
          : viewport.clientWidth;
        viewport.scrollBy({
          left: distance,
          behavior: reducedMotion.matches ? "auto" : "smooth",
        });
      });
      viewport.addEventListener("scroll", () => syncNextButton(row), {
        passive: true,
      });
    });
    render();
    addEventListener(
      "resize",
      () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(render, 150);
      },
      { passive: true },
    );
    reducedMotion.addEventListener("change", render);
  };

  if (location.hash === "#operacoes") {
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
    loadObserver.observe(root);
  } else {
    setTimeout(initialize, 0);
  }
})();
