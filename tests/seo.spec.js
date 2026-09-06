const { test, expect } = require("@playwright/test");

const siteUrl = "https://ascendalogistics.com.br";
const routes = [
  "/",
  "/captacao-de-embarcadores/",
  "/marketing-para-transportadoras/",
  "/perfil-logistico/",
  "/sobre/",
  "/politica-de-privacidade/",
  "/termos/",
];

test("rotas públicas mantêm metadados, semântica e imagens estáveis", async ({
  page,
}) => {
  for (const route of routes) {
    await page.goto(route);
    const canonical = route === "/" ? `${siteUrl}/` : `${siteUrl}${route}`;

    expect(await page.title()).not.toBe("");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /\S/,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /^index,follow/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      canonical,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      canonical,
    );
    await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveCount(
      1,
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("body > header.site-header")).toHaveCount(1);
    await expect(page.locator("body > footer.site-footer")).toHaveCount(1);
    await expect(page.locator('a[href="#conteudo"]')).toHaveCount(1);

    const imageProblems = await page.locator("img").evaluateAll((images) =>
      images.flatMap((image) => {
        const problems = [];
        if (!image.hasAttribute("alt")) problems.push(`${image.src}:alt`);
        if (!image.hasAttribute("width")) problems.push(`${image.src}:width`);
        if (!image.hasAttribute("height")) problems.push(`${image.src}:height`);
        return problems;
      }),
    );
    expect(imageProblems, route).toEqual([]);

    const schemas = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.flatMap((script) => {
          const data = JSON.parse(script.textContent);
          const nodes = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
          return nodes.map((node) => node["@type"]);
        }),
      );
    expect(schemas, route).not.toContain("FAQPage");
    if (route === "/") {
      expect(schemas).toEqual(
        expect.arrayContaining(["Organization", "WebSite", "WebPage", "Service"]),
      );
    } else {
      expect(schemas).toContain("BreadcrumbList");
    }
  }
});

test("CTAs preservam parâmetros de campanha permitidos", async ({ page }) => {
  await page.goto(
    "/?utm_source=google&utm_medium=cpc&utm_campaign=transportadoras&gclid=abc123&debug=nao-enviar",
  );
  const href = await page.locator("[data-form-link]").first().getAttribute("href");
  const destination = new URL(href);

  expect(`${destination.origin}${destination.pathname}`).toBe(
    "https://forms.fillout.com/t/a1tgNciQp6us",
  );
  expect(destination.searchParams.get("utm_source")).toBe("google");
  expect(destination.searchParams.get("utm_medium")).toBe("cpc");
  expect(destination.searchParams.get("utm_campaign")).toBe("transportadoras");
  expect(destination.searchParams.get("gclid")).toBe("abc123");
  expect(destination.searchParams.has("debug")).toBe(false);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${siteUrl}/`,
  );
});

test("formatos modernos são entregues com PNG de fallback", async ({ page }) => {
  await page.goto("/#resultados");
  const image = page.locator(".results-showcase__logo-art").first();
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveAttribute("src", /\.png$/);
  await expect(image).toHaveAttribute("srcset", /\.webp$/);
  await expect
    .poll(() => image.evaluate((element) => element.currentSrc))
    .toMatch(/\.webp$/);
});

test("documentos de rastreamento refletem somente rotas canônicas", async ({
  request,
}) => {
  const [robotsResponse, sitemapResponse, llmsResponse] = await Promise.all([
    request.get("/robots.txt"),
    request.get("/sitemap.xml"),
    request.get("/llms.txt"),
  ]);
  expect(robotsResponse.ok()).toBe(true);
  expect(sitemapResponse.ok()).toBe(true);
  expect(llmsResponse.ok()).toBe(true);

  const robots = await robotsResponse.text();
  const sitemap = await sitemapResponse.text();
  const llms = await llmsResponse.text();
  expect(robots).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
  expect(sitemap).not.toContain("<lastmod>");
  expect(sitemap).not.toContain("404.html");
  expect((sitemap.match(/<loc>/g) || []).length).toBe(routes.length);
  expect(llms).toContain("# Ascenda Logistics");
  expect(llms).toContain(siteUrl);
});

test("página 404 permanece fora do índice", async ({ page }) => {
  await page.goto("/404.html");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,nofollow,noarchive",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator("h1")).toHaveCount(1);
});
