export async function getTextFromElements(page, locator) {
  const elements = await page.$$(locator);
  const texts = [];
  for (let el of elements) {
    texts.push((await el.textContent()).trim());
  }
  return texts;
}