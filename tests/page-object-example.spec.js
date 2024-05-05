import { expect, test } from '@playwright/test';
import { BestBuyHomePage } from '../pom/BestBuyHomePage';
import { BestBuySearchResultsPage } from '../pom/BestBuySearchResultsPage';
import { cleanupFolder, consoleErrorsFolder, logsFolder, savePageSource, writeConsoleErrorsToFile } from '../utils/FileUtils';
import { getDateAndTimeInString } from '../utils/StringUtils';
import { attachConsoleErrorsListeners } from '../utils/PageUtils';

const pageConsoleErrors = [];
const pageJsErrors = [];

test.beforeEach(async ({ page, context, request }) => {
  attachConsoleErrorsListeners(page, pageConsoleErrors, pageJsErrors);
});

test.afterEach(async ({ page }) => {
  if (test.info().status === 'failed') {
    const pageSource = await page.content();
    const fileName = 'page_source_' + test.info().title.replace(/\s/g, '_') + '_' + getDateAndTimeInString() + '.html';
    console.log('');
    console.log(`writing failed page source to file - ${fileName}`);
    console.log('');
    savePageSource(fileName, pageSource);
  }
  if (test.info().status === 'failed') {
    let csvFileName = 'console_errors_' + getDateAndTimeInString() + '_' + test.info().status + '_' + test.info().title + '.csv';
    csvFileName = `${csvFileName}`.replace(/(:|\/)/g, '_').replace(/,/g, '_').replace(/\s/g, '_');
    console.log(`writing console errors to file - ${csvFileName}`);
    console.log('');
    writeConsoleErrorsToFile(pageConsoleErrors, pageJsErrors, csvFileName);
  }
});

test(`logs cleanup when running test set - one time before all tests`, async () => {
  // cannot be in beforeEach or beforeAll,
  // those run not only once in parallel (once per each worker),
  // so cleanup once from here as a separate test
  cleanupFolder(logsFolder);
  cleanupFolder(consoleErrorsFolder);
});

// test(`non page object example for comparison`, async ({page}) => {
//   // define test parameters, input values
//   const productToSearch = 'Apple - AirPods Pro (2nd generation) with MagSafe Case (USB‑C) - White';
//   const locatorSearchInput = '.search-input';
//   const locatorProductLinks = '.sku-title a';
//   // test scenario steps below
//   await page.goto(`https://www.bestbuy.com`);
//   await page.locator(locatorSearchInput).fill(productToSearch);
//   await page.locator(locatorSearchInput).press('Enter');
//   await page.waitForTimeout(5000);
//   expect(await page.locator(locatorProductLinks).first().textContent()).toBe(productToSearch);
// });

test('best buy search test - search by full exact name - playwright - page object', async ({ page }) => {
  // define test parameters, input values
  const productToSearch = 'Apple - AirPods Pro (2nd generation) with MagSafe Case (USB‑C) - White';
  // test scenario steps below
  const bestBuyHomePage = new BestBuyHomePage(page);
  await bestBuyHomePage.open();
  await bestBuyHomePage.search(productToSearch);
  const bestBuySearchResultsPage = new BestBuySearchResultsPage(page);
  const products = await bestBuySearchResultsPage.getProductNames();
  console.log(`verify that the first product in results = [${productToSearch}]`);
  expect(products[0], `the first product in results is not [${productToSearch}]`).toBe(productToSearch);
});

test('failed test example', async ({ page }) => {
  const bestBuyHomePage = new BestBuyHomePage(page);
  await bestBuyHomePage.open();
  console.log(`assert page title`);
  expect(await page.title(), 'unexpected page title').toBe('Google');
});