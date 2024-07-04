const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page, context, request }) => {
  process.playwrightPage = page;
  process.playwrightContext = context;
  process.playwrightRequest = request;
  console.log();
  console.log('Test started:', new Date().toLocaleString());
  console.log();
});

async function isElementPresent1(locator) {
  const page = process.playwrightPage;
  return await page.locator(locator).count() > 0;
}

async function isElementPresent2(locator) {
  const page = process.playwrightPage;
  return (await page.$$(locator)).length > 0;
}

async function isElementPresent3(locator) {
  const page = process.playwrightPage;
  // const element = await page.locator(locator); // true for non-existing
  // const element = await page.$$(locator); // true for non-existing
  const element = await page.$(locator);
  if (element) {
    return true;
  } else {
    return false;
  }
}

test(`is element present example`, async ({ page }) => {
  const locator = '//h2[text()="Failed Bank List"]';
  await page.goto(`https://www.fdic.gov/resources/resolutions/bank-failures/failed-bank-list/index.html`);
  console.log(`isElementPresent1 - ${await isElementPresent1(locator)}`);
  console.log(`isElementPresent2 - ${await isElementPresent2(locator)}`);
  console.log(`isElementPresent3 - ${await isElementPresent3(locator)}`);
});