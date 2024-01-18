const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pom/HomePage');
const { SearchResultsPage } = require('../pom/SearchResultsPage');

test('best buy search test - search by full exact name - playwright - page object', async ({ page }) => {
  const productToSearch = 'Apple - AirPods Pro (2nd generation) with MagSafe Case (USB‑C) - White';
  const homePage = new HomePage(page);
  await homePage.open();
  await homePage.search(productToSearch);
  const searchResultsPage = new SearchResultsPage(page);
  const products = await searchResultsPage.getProductNames();
  console.log(`verify that the first product in results = [${productToSearch}]`);
  expect(products[0], `the first product in results is not [${productToSearch}]`).toBe(productToSearch);
});