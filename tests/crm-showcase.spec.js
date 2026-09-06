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
    expect(dimensions.scrollable, screenshots[index]).toEqual([]);
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

test("alternância automática segue em loop e seleção manual não a interrompe", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/#dados");
  await page.locator("[data-crm-carousel]").scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.clock.runFor(8_500);
  await expect(page.locator('[data-crm-dot="1"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
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
