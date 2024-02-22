export async function getTextFromElements(page, locator) {
  const elements = await page.$$(locator);
  const texts = [];
  for (let el of elements) {
    texts.push((await el.textContent()).trim());
  }
  return texts;
}

async function getNumberOfElements(page, locator) {
  const result = (await page.$$(locator)).length;
  console.log(`found [${result}] elements for [${locator}]`);
  return result;
}