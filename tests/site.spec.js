const { test, expect } = require('@playwright/test');
test('home carrega e CTA chega à chamada final', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toContainText('Novos embarcadores');
  const heroVideo=page.locator('video.hero-video');
  await expect(heroVideo).toHaveAttribute('autoplay','');
  await expect(heroVideo).toHaveAttribute('loop','');
  await expect(heroVideo.locator('source')).toHaveAttribute('src','/assets/img/hero-truck.mp4#t=1');
  await expect(heroVideo).toHaveJSProperty('paused',false);
  await expect(page.locator('.context-card')).toHaveCount(0);
  await page.getByRole('link',{name:/Quero novos embarcadores/}).first().click();
  await expect(page.locator('#formulario')).toBeInViewport();
});
test('páginas SEO têm canonical', async ({ page }) => {
  for (const path of ['/captacao-de-embarcadores/','/marketing-para-transportadoras/','/perfil-logistico/']) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  }
});

test('seção de diferença preserva fluxo, critérios e responsividade', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('[data-difference]');
  await expect(section).toBeVisible();
  await expect(section.locator('[data-criterion]')).toHaveCount(4);
  await expect(section.locator('[data-path]')).toHaveCount(5);
  await expect(section.locator('[data-scene]')).toHaveCount(6);
  const sceneImage = section.locator('.difference-scene-image');
  await expect(sceneImage).toHaveAttribute(
    'src',
    '/assets/img/difference-logistics-diorama-v2.png',
  );
  await expect
    .poll(() => sceneImage.evaluate((image) => image.naturalWidth))
    .toBeGreaterThan(1600);
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveClass(/is-active/);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
});

test('tipos de embarcadores preserva composição, imagens e enquadramento', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');
  const section = page.locator('[data-shippers]');
  const cards = section.locator('[data-shipper-card]');
  const images = section.locator('.shipper-type-card__image');

  await expect(section).toBeVisible();
  await expect(cards).toHaveCount(4);
  await expect(images).toHaveCount(4);
  await expect
    .poll(() => images.evaluateAll((items) => items.every((image) => image.naturalWidth > 1600)))
    .toBe(true);

  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveClass(/is-active/);
  await cards.nth(1).hover();
  await expect(cards.nth(1)).not.toHaveCSS('transform', 'none');

  await expect
    .poll(() =>
      section.evaluate(
        (element) => element.getBoundingClientRect().right <= window.innerWidth,
      ),
    )
    .toBe(true);
});

test('perfil logístico mantém movimento suave em todos os navegadores', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#perfil');
  const rotator = section.locator('.profile-orbit__rotator');
  const pills = rotator.locator('.orbit-pill');

  await expect(section).toBeVisible();
  await expect(rotator).toHaveCount(1);
  await expect(pills).toHaveCount(6);
  await expect
    .poll(() =>
      section.evaluate((element) => {
        const orbit = element.querySelector('.profile-orbit');
        const cards = [...element.querySelectorAll('.orbit-pill')];
        const orbitRect = orbit.getBoundingClientRect();
        const orbitCenter = {
          x: orbitRect.left + orbitRect.width / 2,
          y: orbitRect.top + orbitRect.height / 2,
        };
        const centers = cards.map((card) => {
          const rect = card.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
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
  if (page.viewportSize().width <= 560) {
    await expect(rotator).toHaveCSS('animation-name', 'profileOrbitMobileDrift');
    await expect(rotator).toHaveCSS('animation-duration', '5.5s');
    await expect(pills.first()).toHaveCSS('animation-name', 'none');
  } else {
    await expect(rotator).toHaveCSS('animation-name', 'profileOrbitRotate');
    await expect(rotator).toHaveCSS('animation-duration', '24s');
    await expect(pills.first()).toHaveCSS(
      'animation-name',
      'profileOrbitCounterRotate',
    );
  }

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

  await page.emulateMedia({ reducedMotion: 'reduce' });
  if (page.viewportSize().width <= 560) {
    await expect(rotator).toHaveCSS('animation-name', 'profileOrbitMobileDrift');
    await expect(pills.first()).toHaveCSS('animation-name', 'none');
  } else {
    await expect(rotator).toHaveCSS('animation-name', 'profileOrbitRotate');
    await expect(pills.first()).toHaveCSS(
      'animation-name',
      'profileOrbitCounterRotate',
    );
  }
});
