import { expect } from '@playwright/test';

export async function getTextFromElements(locator) {
  const page = process.playwrightPage;
  const elements = await page.locator(locator).all();
  const texts = [];
  for (let el of elements) {
    texts.push((await el.textContent()).trim());
  }
  return texts;
}

export async function getNumberOfElements(locator) {
  const page = process.playwrightPage;
  return await page.locator(locator).count();
}

export async function isElementPresent(locator) {
  const page = process.playwrightPage;
  return await page.locator(locator).count() > 0;
}

export async function getTextFromElement(locator) {
  const page = process.playwrightPage;
  let result = '';
  if (await isElementPresent(locator)) {
    result = await (await page.$(locator)).textContent();
  }
  return result;
}

export async function clickOnElement(locator) {
  const page = process.playwrightPage;
  await page.locator(locator).first().click();
}

export async function assertTextIsPresent(text) {
  const page = process.playwrightPage;
  console.log(`assert text [${text}] is present on the page`);
  const textFound = await page.locator(`//*[contains(text(),"${text}")]`).count() > 0;
  expect(textFound, `Cannot find text [${text}] on the page ${page.url()}`).toBe(true);
}