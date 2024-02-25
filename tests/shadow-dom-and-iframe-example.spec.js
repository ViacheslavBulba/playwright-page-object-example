const { test, expect } = require('@playwright/test');

test(`shadow dom example`, async ({ page }) => {
  const locatorAcceptCookies = '#onetrust-accept-btn-handler';
  const locatorMakeDropdown = 'select#input'; // shadow dom element
  const locatorModelsDropdown = 'select[name="models[]"]'; // shadow dom element
  const locatorShowResultsButton = 'button[type="submit"]'; // shadow dom element
  await page.goto(`https://www.cars.com`);
  await page.locator(locatorAcceptCookies).first().click();
  await page.locator(locatorMakeDropdown).first().selectOption('Toyota');
  await page.locator(locatorModelsDropdown).first().selectOption('Sequoia');
  await page.locator(locatorShowResultsButton).first().click();
  expect(page.url()).toContain('https://www.cars.com/shopping/results/?stock_type=all&makes%5B%5D=toyota&models%5B%5D=toyota-sequoia&maximum_distance=30');
});

test(`iframe example`, async ({ page }) => {
  const locatorAcceptCookies = '#onetrust-accept-btn-handler';
  const locatorFeedbackSlider = '//*[contains(@id,"slider-control")]';
  const locatorFeedbackOption = '//*[text()="Experience using Cars.com"]';
  const locatorIFrame = 'iframe[title="Feedback/Survey"]';
  await page.goto(`https://www.cars.com`);
  await page.locator(locatorAcceptCookies).first().click();
  await page.waitForTimeout(2000);
  await page.locator(locatorFeedbackSlider).first().click();
  await page.waitForTimeout(2000);
  // await page.locator(locatorFeedbackOption).first().click();
  await page.frameLocator(locatorIFrame).locator(locatorFeedbackOption).first().click();
});