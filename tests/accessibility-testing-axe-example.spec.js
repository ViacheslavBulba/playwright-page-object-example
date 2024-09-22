import { expect, test } from '@playwright/test';
const AxeBuilder = require('@axe-core/playwright').default;

test('axe - should not have any automatically detectable accessibility issues', async ({ page }) => {
  await page.goto('https://www.bestbuy.com/');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
