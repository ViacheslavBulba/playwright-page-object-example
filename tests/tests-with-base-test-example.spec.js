import { expect, test } from '@playwright/test';
import { CustomTest } from '../utils/BaseTest';

// how to extend basic 'test' functionality to include additional actions/logic

CustomTest(`test 1`, async ({ page }) => {
  await page.goto('https://www.google.com/');
  expect(true).toBe(true);
});

CustomTest(`test 2`, async ({ page }) => {
  await page.goto('https://www.google.com/');
  expect(true).toBe(true);
});

CustomTest(`test 3`, async ({ page }) => {
  await page.goto('https://www.google.com/');
  expect(true).toBe(true);
});

CustomTest(`test 4`, async ({ page }) => {
  await page.goto('https://www.google.com/');
  expect(true).toBe(true);
});

CustomTest(`test 5`, async ({ page }) => {
  await page.goto('https://www.google.com/');
  expect(true).toBe(false);
});