const { test, expect } = require('@playwright/test');
test.use({deviceScaleFactor:2});

test('demonstração navega pelas quatro telas e preserva leitura sem corte', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'desktop') await page.setViewportSize({width:1366,height:768});
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#dados');
  await page.evaluate(() => document.fonts.ready);
  const carousel = page.locator('[data-crm-carousel]');
  await expect(carousel.getByRole('button', { name: 'Reproduzir alternância automática' })).toBeVisible();
  const buttons = carousel.locator('[data-crm-tab]');
  const screenshots = ['leads', 'kanban', 'funil', 'insights'];
  for (let index=0; index<4; index++) {
    await buttons.nth(index).click();
    await expect(carousel.locator('.crm-demo:visible')).toHaveCount(1);
    await expect(buttons.nth(index)).toHaveAttribute('aria-pressed','true');
    await expect(carousel.locator('[data-crm-count]')).toHaveText(`0${index+1} / 04`);
    const dimensions = await carousel.evaluate(element => ({width:element.getBoundingClientRect().width, viewport:innerWidth, overflow:document.documentElement.scrollWidth>innerWidth, screenOverflow:element.querySelector('.crm-demo:not([hidden])').scrollHeight>element.querySelector('.crm-demo:not([hidden])').clientHeight+1}));
    expect(dimensions.overflow).toBe(false);
    await page.screenshot({path:testInfo.outputPath(`${screenshots[index]}.png`)});
    if (testInfo.project.name === 'desktop') await carousel.locator('.crm-demo:visible').screenshot({path:testInfo.outputPath(`mockup-${screenshots[index]}-2x.png`)});
    if (testInfo.project.name === 'desktop') expect(dimensions.screenOverflow, screenshots[index]).toBe(false);
  }
  await carousel.getByRole('button',{name:'Próxima tela',exact:true}).click();
  await expect(buttons.nth(0)).toHaveAttribute('aria-pressed','true');
  await carousel.getByRole('button',{name:'Tela anterior',exact:true}).click();
  await expect(buttons.nth(3)).toHaveAttribute('aria-pressed','true');
  await buttons.nth(0).focus();
  await page.keyboard.press('Enter');
  await expect(buttons.nth(0)).toHaveAttribute('aria-pressed','true');
  if (testInfo.project.name === 'desktop') {
    const bounds = await page.locator('#dados').boundingBox();
    expect(bounds.height).toBeLessThanOrEqual(768-83);
  }
});

test('alternância automática respeita pausa, foco e movimento reduzido', async ({page}) => {
  await page.clock.install();
  await page.goto('/#dados');
  await page.locator('[data-crm-carousel]').scrollIntoViewIfNeeded();
  await page.mouse.move(0,0);
  await page.clock.runFor(9000);
  await expect(page.locator('[data-crm-count]')).toHaveText('02 / 04');
  await page.getByRole('button',{name:'Pausar alternância automática'}).click();
  await page.mouse.move(0,0);
  await page.clock.runFor(18000);
  await expect(page.locator('[data-crm-count]')).toHaveText('02 / 04');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.getByRole('button',{name:'Reproduzir alternância automática'})).toBeVisible();
  await page.clock.runFor(18000);
  await expect(page.locator('[data-crm-count]')).toHaveText('02 / 04');
});
