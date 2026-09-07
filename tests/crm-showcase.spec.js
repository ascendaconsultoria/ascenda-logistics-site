const { test, expect } = require("@playwright/test");

test.use({ deviceScaleFactor: 2 });

test("demonstração navega pelas quatro telas sem rolagem interna", async ({
  page,
}, testInfo) => {
  if (testInfo.project.name === "desktop")
    await page.setViewportSize({ width: 1366, height: 768 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#dados");
  await page.evaluate(() => document.fonts.ready);
  const carousel = page.locator("[data-crm-carousel]");
  const tabs = carousel.locator("[data-crm-tab]");
  const dots = page.locator("[data-crm-dot]");
  const screenshots = ["leads", "kanban", "funil", "insights"];

  await expect(dots).toHaveCount(4);
  if (testInfo.project.name === "mobile") {
    const mobileKanban = carousel.locator(".crm-demo__mobile-kanban");
    await expect(carousel.locator(".crm-showcase__navigation")).toBeHidden();
    await expect(dots.first()).toBeHidden();
    await expect(carousel.locator("#crm-screen-kanban")).toBeVisible();
    await expect(carousel.locator(".crm-demo__board")).toBeHidden();
    await expect(mobileKanban).toBeVisible();
    await expect(mobileKanban.locator(".crm-demo__column")).toHaveCount(1);
    await expect(mobileKanban.locator(".crm-demo__lead")).toHaveCount(2);
    await expect(mobileKanban.locator(".crm-demo__lead-bottom")).toHaveCount(0);
    await expect(mobileKanban).not.toContainText("Aderência");
    await expect(mobileKanban).not.toContainText("Perfil compatível");
    await expect
      .poll(() =>
        carousel.evaluate((element) => {
          const panel = element.querySelector(".crm-demo:not([hidden])");
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            panelOverflow: panel.scrollHeight > panel.clientHeight + 1,
          };
        }),
      )
      .toEqual({ overflow: false, panelOverflow: false });
    await page.screenshot({ path: testInfo.outputPath("kanban-mobile.png") });
    return;
  }

  for (let index = 0; index < 4; index += 1) {
    await dots.nth(index).click();
    await expect(carousel.locator(".crm-demo:visible")).toHaveCount(1);
    await expect(dots.nth(index)).toHaveAttribute("aria-pressed", "true");
    await expect(tabs.nth(index)).toHaveAttribute("aria-pressed", "true");
    const dimensions = await carousel.evaluate((element) => {
      const panel = element.querySelector(".crm-demo:not([hidden])");
      const scrollable = [...element.querySelectorAll("*")].filter((node) => {
        const style = getComputedStyle(node);
        return (
          ["auto", "scroll"].includes(style.overflow) ||
          ["auto", "scroll"].includes(style.overflowY)
        );
      });
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        panelOverflow: panel.scrollHeight > panel.clientHeight + 1,
        scrollable: scrollable.map((node) => node.className),
      };
    });
    expect(dimensions.overflow, JSON.stringify(dimensions)).toBe(false);
    expect(dimensions.panelOverflow, screenshots[index]).toBe(false);
    if (testInfo.project.name === "desktop") {
      expect(dimensions.scrollable, screenshots[index]).toEqual([]);
    }
    await page.screenshot({
      path: testInfo.outputPath(`${screenshots[index]}.png`),
    });
    if (testInfo.project.name === "desktop") {
      await carousel.locator(".crm-demo:visible").screenshot({
        path: testInfo.outputPath(`mockup-${screenshots[index]}-2x.png`),
      });
    }
  }

  if (testInfo.project.name === "desktop") {
    const bounds = await page.locator("#dados").boundingBox();
    expect(bounds.height).toBeLessThanOrEqual(768);
  }
});

test("alternância automática permanece no desktop e é desativada no mobile", async ({
  page,
}, testInfo) => {
  await page.clock.install();
  await page.goto("/#dados");
  await page.locator("[data-crm-carousel]").scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.clock.runFor(8_500);
  await expect(page.locator('[data-crm-dot="1"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  if (testInfo.project.name === "mobile") {
    await expect(page.locator("#crm-screen-kanban")).toBeVisible();
    await page.clock.runFor(8_500);
    await expect(page.locator('[data-crm-dot="1"]')).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    return;
  }
  await page.locator('[data-crm-dot="3"]').click();
  await expect(page.locator('[data-crm-dot="3"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.clock.runFor(8_500);
  await expect(page.locator('[data-crm-dot="0"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
