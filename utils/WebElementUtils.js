export async function getTextFromElements(page, locator) {
  const elements = await page.locator(locator).all();
  const texts = [];
  for (let el of elements) {
    texts.push((await el.textContent()).trim());
  }
  return texts;
}

export async function getNumberOfElements(page, locator) {
  return await page.locator(locator).count();
}

export async function isElementPresent(page, locator) {
  return await page.locator(locator).count() > 0;
}

export async function getTextFromElement(page, locator) {
  let result = '';
  if (await isElementPresent(page, locator)) {
    result = await (await page.$(locator)).textContent();
  }
  return result;
}

export async function clickOnElement(page, locator) {
  await page.locator(locator).first().click();
}