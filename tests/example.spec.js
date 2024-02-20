const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pom/HomePage');
const { SearchResultsPage } = require('../pom/SearchResultsPage');

// test(`non page object example for reference`, async ({page}) => {
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
  const homePage = new HomePage(page);
  await homePage.open();
  await homePage.search(productToSearch);
  const searchResultsPage = new SearchResultsPage(page);
  const products = await searchResultsPage.getProductNames();
  console.log(`verify that the first product in results = [${productToSearch}]`);
  expect(products[0], `the first product in results is not [${productToSearch}]`).toBe(productToSearch);
});

test(`shadow dom example`, async ({ page }) => {
  const locatorAcceptCookies = '#onetrust-accept-btn-handler';
  const locatorMakeDropdown = 'select#input'; // shadow dom element
  const locatorModelsDropdown = 'select[name="models[]"]'; // shadow dom element
  const locatorShowResultsButton = 'button[type="submit"]';
  await page.goto(`https://www.cars.com`);
  // await page.waitForTimeout(5000);
  await page.locator(locatorAcceptCookies).first().click();
  await page.locator(locatorMakeDropdown).first().selectOption('Toyota');
  await page.locator(locatorModelsDropdown).first().selectOption('Sequoia');
  await page.locator(locatorShowResultsButton).first().click();
  expect(page.url()).toContain('https://www.cars.com/shopping/results/?stock_type=all&makes%5B%5D=toyota&models%5B%5D=toyota-sequoia&maximum_distance=30');
});

async function getNumberOfElements(page, locator) {
  const result = (await page.$$(locator)).length;
  console.log(`found [${result}] elements for [${locator}]`);
  return result;
}