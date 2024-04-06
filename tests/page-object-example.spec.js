const { test, expect } = require('@playwright/test');
const { BestBuyHomePage } = require('../pom/BestBuyHomePage');
const { BestBuySearchResultsPage } = require('../pom/BestBuySearchResultsPage');

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