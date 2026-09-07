const { test, expect } = require("@playwright/test");
const filloutUrl = "https://forms.fillout.com/t/a1tgNciQp6us";

test("home carrega e CTAs comerciais abrem o Fillout", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Ajudamos a sua transportadora a conquistar novos embarcadores",
  );
  await expect(page.locator(".hero-copy > p")).toHaveText(
    "Criamos campanhas para atrair empresas com demanda de transporte e filtramos cada oportunidade de acordo com as rotas, cargas e operação da sua transportadora.",
  );
  const heroVideo = page.locator("video.hero-video");
  await expect(heroVideo).toHaveAttribute("autoplay", "");
  await expect(heroVideo).toHaveAttribute("loop", "");
  await expect(heroVideo).toHaveAttribute(
    "poster",
    "/assets/img/hero-truck-poster.webp",
  );
  await expect(heroVideo.locator("source")).toHaveAttribute(
    "src",
    "/assets/img/hero-truck-optimized.mp4#t=1",
  );
  await expect(heroVideo).toHaveJSProperty("paused", false);
  await expect(page.locator(".context-card")).toHaveCount(0);
  const heroCta = page
    .getByRole("link", { name: /Quero novos embarcadores/ })
    .first();
  await expect(heroCta).toHaveAttribute("href", filloutUrl);
  await expect(heroCta).toHaveAttribute("target", "_blank");
});
test("páginas SEO têm canonical", async ({ page }) => {
  for (const path of [
    "/captacao-de-embarcadores/",
    "/marketing-para-transportadoras/",
    "/perfil-logistico/",
  ]) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  }
});

test("seção de diferença preserva as cinco etapas, ícones e responsividade", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator("[data-difference]");
  const steps = section.locator("[data-fit-step]");
  await expect(section).toBeVisible();
  await expect(steps).toHaveCount(5);
  const icons = section.locator(".fit-step__icon img");
  await expect(icons).toHaveCount(5);
  await expect(icons.first()).toHaveAttribute(
    "src",
    /difference-icons\/operacao\.png$/,
  );
  await expect(section.getByRole("heading", { level: 2 })).toContainText(
    "Nem todo embarcador",
  );
  await expect(
    section.getByRole("link", { name: /Falar com um especialista/ }),
  ).toBeVisible();
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveClass(/is-active/);

  await page.setViewportSize({ width: 390, height: 844 });
  const flow = section.locator("[data-fit-flow]");
  const nextButton = section.getByRole("button", { name: "Ver próximo card" });
  await expect(nextButton).toBeVisible();
  const initialScroll = await flow.evaluate((element) => element.scrollLeft);
  await nextButton.click();
  await expect
    .poll(() => flow.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(initialScroll);
  await flow.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
  });
  await expect(nextButton).toBeHidden();
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
});

test("tipos de embarcadores preserva composição, imagens e enquadramento", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  const section = page.locator("[data-shippers]");
  const cards = section.locator("[data-shipper-card]");
  const images = section.locator(".shipper-type-card__image");

  await expect(section).toBeVisible();
  await expect(cards).toHaveCount(4);
  await expect(images).toHaveCount(4);
  await expect
    .poll(() =>
      images.evaluateAll((items) =>
        items.every((image) => image.naturalWidth > 1600),
      ),
    )
    .toBe(true);

  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveClass(/is-active/);
  await cards.nth(1).hover();
  await expect(cards.nth(1)).not.toHaveCSS("transform", "none");
  const cardCopy = cards.nth(2).locator("p");
  const cardIcon = cards.nth(2).locator(".shipper-type-card__segment-icon");
  await expect(cardCopy).toHaveCSS("font-size", "11px");
  const copyLayout = await Promise.all([
    cardCopy.boundingBox(),
    cardIcon.boundingBox(),
  ]);
  expect(copyLayout[0].y).toBeGreaterThan(
    copyLayout[1].y + copyLayout[1].height,
  );

  await expect
    .poll(() =>
      section.evaluate(
        (element) => element.getBoundingClientRect().right <= window.innerWidth,
      ),
    )
    .toBe(true);
  await expect
    .poll(() =>
      section.evaluate((element) =>
        element.nextElementSibling?.matches(".inline-cta"),
      ),
    )
    .toBe(true);
});

test("redes de captação incorpora o frame do v0 sem corte ou overflow", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/#redes");
  const section = page.locator("[data-capture-network]");
  const panel = section.locator(".capture-hybrid__desktop-image");
  const mobilePanel = section.locator(".capture-mobile-network");

  await expect(section).toBeVisible();
  await expect(panel).toHaveCount(1);
  await expect(panel).toHaveAttribute(
    "src",
    "/assets/img/redes-captacao-painel.png",
  );
  await expect
    .poll(() =>
      panel.evaluate((image) => ({
        width: image.naturalWidth,
        height: image.naturalHeight,
      })),
    )
    .toEqual({ width: 1400, height: 616 });
  await expect(section.getByRole("heading", { level: 2 })).toContainText(
    "De onde os",
  );
  await expect(section.locator(".capture-hybrid__quote")).toContainText(
    "Por trás de todo CNPJ existe uma pessoa tomando decisões.",
  );
  await expect(section.locator(".capture-hybrid__quote small")).toHaveText(
    "Uma empresa pode estar insatisfeita com o fornecedor atual, ampliando rotas ou buscando uma nova solução. A comunicação certa transforma esse cenário em oportunidade.",
  );
  await expect(section.locator("[data-capture-card]")).toHaveCount(4);
  await expect(mobilePanel).toBeHidden();

  await page.evaluate(() => document.querySelector("#redes").scrollIntoView());
  await expect
    .poll(() =>
      section.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const header = document.querySelector(".site-header");
        const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
        return rect.top >= headerBottom && rect.right <= window.innerWidth;
      }),
    )
    .toBe(true);
  if (testInfo.project.name === "desktop") {
    const figure = section.locator(".capture-hybrid__panel");
    await figure.hover();
    await expect(figure).not.toHaveCSS("transform", "none");
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(panel).toBeHidden();
  await expect(mobilePanel).toBeVisible();
  await expect(mobilePanel.locator("[data-capture-card]")).toHaveCount(4);
  await expect(mobilePanel.getByText("Meta", { exact: true })).toBeVisible();
  await expect(mobilePanel.getByText("Google", { exact: true })).toBeVisible();
  await expect(
    mobilePanel.getByText("Site + presença", { exact: true }),
  ).toBeVisible();
  await expect(
    mobilePanel.getByText("Telefone + WhatsApp", { exact: true }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
});

test("perfil logístico mantém movimento suave em todos os navegadores", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator("#perfil");
  const rotator = section.locator(".profile-orbit__rotator");
  const pills = rotator.locator(".orbit-pill");

  await expect(section).toBeVisible();
  await expect(rotator).toHaveCount(1);
  await expect(pills).toHaveCount(6);
  if (page.viewportSize().width <= 560) {
    const core = section.locator(".orbit-core");
    const coreLogo = core.locator("img");
    await expect(rotator).toHaveCSS("display", "grid");
    await expect(rotator).toHaveCSS("animation-name", "none");
    await expect(pills.first()).toHaveCSS("position", "relative");
    await expect(pills.first()).toHaveCSS("text-align", "center");
    await expect(coreLogo).toHaveCSS("height", "30px");
    await expect
      .poll(() =>
        core.evaluate((element) => {
          const coreBox = element.getBoundingClientRect();
          const logoBox = element.querySelector("img").getBoundingClientRect();
          return Math.abs(
            logoBox.left + logoBox.width / 2 - (coreBox.left + coreBox.width / 2),
          );
        }),
      )
      .toBeLessThan(1);
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
    return;
  }
  await expect
    .poll(() =>
      section.evaluate((element) => {
        const orbit = element.querySelector(".profile-orbit");
        const cards = [...element.querySelectorAll(".orbit-pill")];
        const orbitRect = orbit.getBoundingClientRect();
        const orbitCenter = {
          x: orbitRect.left + orbitRect.width / 2,
          y: orbitRect.top + orbitRect.height / 2,
        };
        const centers = cards.map((card) => {
          const rect = card.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
        });
        return [
          [0, 5],
          [1, 4],
          [2, 3],
        ].every(([first, opposite]) => {
          const midpoint = {
            x: (centers[first].x + centers[opposite].x) / 2,
            y: (centers[first].y + centers[opposite].y) / 2,
          };
          return (
            Math.abs(midpoint.x - orbitCenter.x) < 2.5 &&
            Math.abs(midpoint.y - orbitCenter.y) < 2.5
          );
        });
      }),
    )
    .toBe(true);
  await expect(rotator).toHaveCSS("animation-name", "profileOrbitRotate");
  await expect(rotator).toHaveCSS("animation-duration", "24s");
  await expect(pills.first()).toHaveCSS(
    "animation-name",
    "profileOrbitCounterRotate",
  );

  const transformBefore = await rotator.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await page.waitForTimeout(400);
  const transformAfter = await rotator.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  expect(transformAfter).not.toBe(transformBefore);

  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(rotator).toHaveCSS("animation-name", "none");
  await expect(pills.first()).toHaveCSS("animation-name", "none");
});

test("operações mostra os dois trilhos e cabe horizontalmente no viewport", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/#operacoes");

  const section = page.locator("#operacoes");
  const cards = section.locator(".operations-showcase__card");
  const specialtyLabel = section.locator(".operations-showcase__group-label");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText(
    "Conheça as operações em que podemos ajudar sua transportadora a captar novos embarcadores.",
  );
  await expect(specialtyLabel).toHaveText("ESPECIAIS");
  await expect(specialtyLabel).toBeVisible();
  await expect(cards).toHaveCount(36);
  await expect(cards.nth(0).getByRole("heading", { level: 3 })).toHaveText(
    "Carga fechada",
  );
  await expect(
    section
      .locator('[data-ops-row="specialties"] .operations-showcase__card')
      .first()
      .getByRole("heading", { level: 3 }),
  ).toHaveText("Refrigerado e congelado");
  const primaryTrack = section.locator(
    '[data-ops-row="primary"] [data-ops-track]',
  );
  const specialtyTrack = section.locator(
    '[data-ops-row="specialties"] [data-ops-track]',
  );
  await expect(primaryTrack).toHaveCSS(
    "animation-name",
    "operationsShowcaseLoop",
  );
  await expect(specialtyTrack).toHaveCSS(
    "animation-name",
    "operationsShowcaseLoop",
  );
  await expect(section.locator(".operations-showcase__number")).toHaveCount(0);
  await expect(section.locator(".operations-showcase__card-arrow")).toHaveCount(
    0,
  );
  await expect(section.locator(".operations-showcase__arrow")).toHaveCount(0);
  await expect
    .poll(() =>
      cards.first().evaluate((card) => card.getBoundingClientRect().height),
    )
    .toBeGreaterThanOrEqual(239);

  const primaryBefore = await primaryTrack.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await expect
    .poll(() =>
      primaryTrack.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(primaryBefore);

  const specialtyBefore = await specialtyTrack.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await expect
    .poll(() =>
      specialtyTrack.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(specialtyBefore);

  const afterClick = await primaryTrack.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await expect
    .poll(
      () =>
        primaryTrack.evaluate((element) => getComputedStyle(element).transform),
      { timeout: 2000 },
    )
    .not.toBe(afterClick);
  if (testInfo.project.name === "desktop") {
    await page.screenshot({
      path: testInfo.outputPath("operations-after.png"),
      fullPage: false,
    });
  }

  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
});

test("operações vira uma galeria de toque legível no mobile", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#operacoes");

  const section = page.locator("#operacoes");
  const rows = section.locator("[data-ops-row]");
  const cards = section.locator(".operations-showcase__card");
  const firstViewport = section.locator(".operations-showcase__viewport").first();
  const specialtyLabel = section.locator(".operations-showcase__group-label");

  await expect(rows).toHaveCount(2);
  await expect(cards).toHaveCount(12);
  await expect(specialtyLabel).toHaveText("ESPECIAIS");
  await expect(specialtyLabel).toBeVisible();
  await expect(rows.first()).toHaveAttribute("data-ops-mode", "scroll");
  await expect(rows.last()).toHaveAttribute("data-ops-mode", "scroll");
  await expect(section.locator("[data-ops-track]").first()).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect
    .poll(() =>
      cards.first().evaluate((card) => {
        const style = getComputedStyle(card, "::before");
        return style.backgroundImage;
      }),
    )
    .toContain("carga-fechada");
  await expect
    .poll(() =>
      cards.first().evaluate((card) => card.getBoundingClientRect().height),
    )
    .toBeGreaterThanOrEqual(290);
  await expect
    .poll(() =>
      firstViewport.evaluate(
        (viewport) => viewport.scrollWidth > viewport.clientWidth,
      ),
    )
    .toBe(true);
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);

  if (testInfo.project.name === "mobile") {
    await page.screenshot({
      path: testInfo.outputPath("operations-mobile.png"),
      fullPage: false,
    });
  }
});

test("home e páginas estratégicas não criam overflow no mobile", async ({
  page,
}) => {
  const routes = [
    "/",
    "/captacao-de-embarcadores/",
    "/marketing-para-transportadoras/",
    "/perfil-logistico/",
    "/sobre/",
    "/politica-de-privacidade/",
    "/termos/",
  ];

  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 800 });
    for (const route of routes) {
      await page.goto(route);
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        )
        .toBe(true);
      await expect(page.locator("h1")).toBeVisible();
    }
  }
});

test("menu mobile abre sem bloquear a navegação e fecha após a escolha", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const toggle = page.locator(".menu-toggle");
  const nav = page.locator(".mobile-menu");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(nav).toBeVisible();
  await nav.getByRole("link", { name: "Operações" }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#operacoes")).toBeInViewport();
});

test("CRM apresenta somente novos leads no Kanban mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#dados");

  const screen = page.locator("#crm-screen-kanban");
  await expect(screen).toBeVisible();
  await expect(
    screen.locator(".crm-demo__mobile-kanban .crm-demo__column"),
  ).toHaveCount(1);
  await expect(
    screen.locator(".crm-demo__mobile-kanban .crm-demo__lead"),
  ).toHaveCount(2);
  await expect(screen.locator(".crm-demo__mobile-kanban")).not.toContainText(
    "Perfil compatível",
  );
  await expect(screen).toHaveCSS("transform", "none");
});

test("operações respeita redução de movimento e mantém navegação manual", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#operacoes");

  const track = page.locator('[data-ops-row="primary"] [data-ops-track]');
  const viewport = page.locator(
    '[data-ops-row="primary"] .operations-showcase__viewport',
  );
  await expect(track).toHaveCSS("animation-name", "none");
  await expect(track).toHaveCSS("transform", "none");
  await expect
    .poll(() =>
      viewport.evaluate((element) => element.scrollWidth > element.clientWidth),
    )
    .toBe(true);
});

test("resultados apresenta cases reais, perfis e prova social sem overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/#resultados");

  const section = page.locator("#resultados");
  const cases = section.locator(".result-case");
  const logos = section.locator(".results-showcase__logo-art");

  await expect(section).toBeVisible();
  await expect(cases).toHaveCount(2);
  await expect(section.getByRole("heading", { level: 2 })).toContainText(
    "Resultados de operações reais",
  );
  await expect(section.getByRole("heading", { level: 2 })).toHaveCSS(
    "font-weight",
    "700",
  );
  await expect(
    cases.nth(0).locator(".result-case__headline strong"),
  ).toHaveText("115");
  await expect(cases.nth(0).locator(".result-case__brand img")).toHaveAttribute(
    "src",
    "/assets/img/clientes/tpl-logistica.png",
  );
  await expect
    .poll(() =>
      cases.nth(0).locator(".result-case__brand img").evaluate((image) => ({
        width: image.naturalWidth,
        height: image.naturalHeight,
      })),
    )
    .toEqual({ width: 2172, height: 724 });
  await expect(
    cases.nth(1).locator(".result-case__headline strong"),
  ).toHaveText("18");
  await expect(cases.nth(1).locator(".result-case__brand img")).toHaveAttribute(
    "src",
    "/assets/img/clientes/solucao.png",
  );
  await expect
    .poll(() =>
      cases.nth(1).locator(".result-case__brand img").evaluate((image) => ({
        width: image.naturalWidth,
        height: image.naturalHeight,
      })),
    )
    .toEqual({ width: 2172, height: 724 });
  await expect(
    section.getByRole("link", { name: /Ver TPL Logística no Instagram/ }),
  ).toHaveAttribute("href", "https://www.instagram.com/tpllogistica/");
  await expect(
    section.getByRole("link", {
      name: /Ver Solução Locação e Transportes no Instagram/,
    }),
  ).toHaveAttribute(
    "href",
    "https://www.instagram.com/solucao.locacao.transportes",
  );
  await expect(section.locator(".result-case__instagram-icon")).toHaveCount(2);
  await expect(
    section.locator(".result-case__instagram-icon").first(),
  ).toHaveAttribute("src", "/assets/img/instagram.svg");
  await expect(logos).toHaveCount(7);
  await expect(section.locator(".results-showcase__logo-frame")).toHaveCount(7);
  await expect(logos.nth(4)).toHaveCSS("object-position", "50% 100%");
  await expect(logos.nth(4)).toHaveCSS(
    "transform",
    "matrix(1.12, 0, 0, 1.12, 0, -10)",
  );
  await expect
    .poll(() =>
      section.locator(".results-showcase__logos li").nth(4).evaluate((card) => {
        const image = card.querySelector(".results-showcase__logo-art");
        const cardBox = card.getBoundingClientRect();
        const imageBox = image?.getBoundingClientRect();
        return Boolean(
          imageBox &&
            imageBox.left <= cardBox.left &&
            imageBox.top <= cardBox.top &&
            imageBox.right >= cardBox.right &&
            imageBox.bottom >= cardBox.bottom,
        );
      }),
    )
    .toBe(true);
  await expect(section.locator(".shipper-type-card__tags")).toHaveCount(0);
  await expect(
    cases.nth(0).locator(".result-case__metrics li").nth(0).locator("strong"),
  ).toHaveText("79%");
  await expect(
    cases.nth(0).locator(".result-case__metrics li").nth(0).locator("span"),
  ).toHaveText("decisores");
  await expect(
    cases.nth(0).locator(".result-case__metrics li").nth(1).locator("strong"),
  ).toHaveText("90%");
  await expect(
    cases.nth(0).locator(".result-case__metrics li").nth(1).locator("span"),
  ).toHaveText("norte");
  await expect(
    cases.nth(0).locator(".result-case__metrics li").nth(2).locator("strong"),
  ).toHaveText("72%");
  await expect(
    cases.nth(0).locator(".result-case__metrics li").nth(2).locator("span"),
  ).toHaveText("fracionado recorrente");
  await expect(
    cases.nth(1).locator(".result-case__metrics li"),
  ).toHaveCount(3);
  await expect(
    cases.nth(1).locator(".result-case__metrics li").nth(0).locator("strong"),
  ).toHaveText("88,9%");
  await expect(
    cases.nth(1).locator(".result-case__metrics li").nth(0).locator("span"),
  ).toHaveText("decisores");
  await expect(
    cases.nth(1).locator(".result-case__metrics li").nth(1).locator("strong"),
  ).toHaveText("70%");
  await expect(
    cases.nth(1).locator(".result-case__metrics li").nth(1).locator("span"),
  ).toHaveText("sudoeste");
  await expect(
    cases.nth(1).locator(".result-case__metrics li").nth(2).locator("strong"),
  ).toHaveText("68,8%");
  await expect(
    cases.nth(1).locator(".result-case__metrics li").nth(2).locator("span"),
  ).toHaveText("fracionado recorrente");
  await expect(section.locator(".results-showcase__proof-head")).toHaveCSS(
    "margin-bottom",
    "16px",
  );
  await expect
    .poll(() =>
      cases.first().evaluate((card) => card.getBoundingClientRect().height),
    )
    .toBeGreaterThanOrEqual(275);
  await expect
    .poll(() =>
      section.locator(".results-showcase__logos").evaluate((list) => {
        const cards = [...list.children].map((item) =>
          item.getBoundingClientRect(),
        );
        const lower = cards.slice(-3);
        const listRect = list.getBoundingClientRect();
        const leftSpace = lower[0].left - listRect.left;
        const rightSpace = listRect.right - lower.at(-1).right;
        return Math.abs(leftSpace - rightSpace) < 2;
      }),
    )
    .toBe(true);
  await expect
    .poll(() =>
      section.locator(".result-case__metrics li").evaluateAll((items) => {
        const boxes = items.map((item) => item.getBoundingClientRect());
        const sameSize = boxes.every(
          (box) =>
            Math.abs(box.width - boxes[0].width) < 1 &&
            Math.abs(box.height - boxes[0].height) < 1,
        );
        const stacked = items.every((item) => {
          const value = item.querySelector("strong")?.getBoundingClientRect();
          const label = item.querySelector("span")?.getBoundingClientRect();
          return value && label && value.top < label.top;
        });
        return sameSize && stacked;
      }),
    )
    .toBe(true);
  await expect(section.locator(".results-showcase__arrow")).toHaveCount(0);
  await expect(section.locator(".results-showcase__progress")).toHaveCount(0);
  await expect(section.locator(".results-showcase__side-note")).toHaveCount(0);
  await expect(section.locator(".results-showcase__microcopy")).toHaveCount(0);
  await expect(section.locator(".results-showcase__disclaimer")).toHaveCount(0);
  await expect
    .poll(() =>
      logos.evaluateAll((items) =>
        items.every(
          (image) => image.naturalWidth === 2172 && image.naturalHeight === 724,
        ),
      ),
    )
    .toBe(true);
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
  await expect(
    section.getByRole("link", { name: /Quero atrair novos embarcadores/ }),
  ).toHaveAttribute("href", filloutUrl);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(logos.nth(4)).toHaveCSS("object-position", "50% 50%");
  await expect(logos.nth(4)).toHaveCSS(
    "transform",
    "matrix(1.04, 0, 0, 1.04, 0, 0)",
  );
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
});

test("mockups, rodapé e páginas internas compartilham os destinos comerciais", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/#dados");

  const crmCta = page.getByRole("link", {
    name: /Quero levar oportunidades ao meu comercial/,
  });
  await expect(crmCta).toBeVisible();
  await expect(crmCta).toHaveAttribute("href", filloutUrl);

  const socials = page.locator(".footer-socials a");
  await expect(socials).toHaveCount(3);
  await expect(socials.nth(0)).toHaveCSS("width", "44px");
  await expect(socials.nth(1).locator("svg")).toHaveClass(/social-icon--brand/);
  await expect(socials.nth(2).locator("svg")).toHaveClass(/social-icon--brand/);
  await expect(socials.nth(0)).toHaveAttribute(
    "href",
    "https://www.instagram.com/marketing.ascenda/",
  );
  await expect(socials.nth(1)).toHaveAttribute(
    "href",
    "https://www.linkedin.com/company/ascenda-logistics",
  );
  await expect(socials.nth(2)).toHaveAttribute(
    "href",
    "https://www.facebook.com/ascendalogistics",
  );

  const whatsapp = page.locator(".whatsapp-float");
  await expect(whatsapp).toHaveCSS("width", "62px");
  await expect(whatsapp).toHaveCSS("height", "62px");
  await expect(whatsapp).toHaveCSS("animation-name", "whatsappButtonPulse");
  await expect(whatsapp).toHaveCSS("animation-duration", "1.6s");
  await expect(whatsapp).toHaveCSS("animation-iteration-count", "infinite");
  const whatsappTransform = await whatsapp.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await expect
    .poll(
      () => whatsapp.evaluate((element) => getComputedStyle(element).transform),
      { timeout: 3500 },
    )
    .not.toBe(whatsappTransform);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(whatsapp).toHaveCSS("animation-name", "whatsappReducedPulse");
  await expect(whatsapp).toHaveCSS("animation-duration", "2.4s");
  await expect(whatsapp.locator("svg")).toHaveAttribute("viewBox", "0 0 24 24");
  await expect(whatsapp.locator("span")).toBeHidden();

  const crmSection = page.locator("#dados");
  const crmSpacing = await crmSection.evaluate((section) => {
    const cta = section.querySelector(".crm-showcase__cta");
    const sectionBox = section.getBoundingClientRect();
    const ctaBox = cta.getBoundingClientRect();
    return sectionBox.bottom - ctaBox.bottom;
  });
  expect(crmSpacing).toBeGreaterThanOrEqual(48);

  for (const path of [
    "/",
    "/captacao-de-embarcadores/",
    "/marketing-para-transportadoras/",
    "/perfil-logistico/",
    "/sobre/",
    "/politica-de-privacidade/",
    "/termos/",
    "/404.html",
  ]) {
    await page.goto(path);
    await expect(page.locator(".header-cta")).toHaveAttribute(
      "href",
      filloutUrl,
    );
    await expect(page.locator(".footer-grid a[href^=\"https://wa.me/\"]")).toHaveAttribute(
      "href",
      "https://wa.me/5519978112013?text=Ol%C3%A1%2C%20conheci%20o%20Ascenda%20pelo%20site%20e%20gostaria%20de%20entender%20como%20posso%20conseguir%20novos%20embarcadores%20para%20minha%20transportadora.",
    );
    await expect(
      page.locator('a[href="#formulario"], a[href="/#formulario"]'),
    ).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText("—");
  }
});

test("escala desktop mantém enquadramento equivalente a 90% sem usar zoom", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");

  await expect(page.locator(".header-inner")).toHaveCSS("height", "74px");
  const dimensions = await page.evaluate(() => ({
    zoom: getComputedStyle(document.body).zoom,
    transform: getComputedStyle(document.body).transform,
    containerWidth: document
      .querySelector(".hero .container")
      .getBoundingClientRect().width,
    overflow: document.documentElement.scrollWidth > innerWidth,
  }));
  expect(dimensions.zoom).toBe("1");
  expect(dimensions.transform).toBe("none");
  expect(dimensions.containerWidth).toBeLessThanOrEqual(1063);
  expect(dimensions.overflow).toBe(false);
});
