import { expect, test } from '@playwright/test';

async function getAttributeFromElements(page, locator, attribute) {
  const elements = await page.locator(locator).all();
  const values = [];
  for (let el of elements) {
    let attr = await el.getAttribute(attribute);
    if (attr === null) {
      attr = '';
    }
    values.push(attr);
  }
  return values;
}

test("find broken links on the page", async ({ page, request }) => {
  const target = 'https://www.eddymens.com/blog/page-with-broken-pages-for-testing-53049e870421';
  console.log(`Testing page for broken links: ${target}`);
  await page.goto(target);
  // await page.waitForTimeout(5000);
  let allHrefs = await getAttributeFromElements(page, '//a', 'href');
  // FILTER OUT SPECIAL CASES
  allHrefs = allHrefs.filter(a => !a.startsWith('#') && !a.startsWith('mailto:') && !a.startsWith('javascript') && !a.startsWith('tel:') && a !== '');
  // FILTER OUT DUPLICATES
  let allHrefsWithoutDuplicates = [];
  for (let i = 0; i < allHrefs.length; i++) {
    if (!allHrefsWithoutDuplicates.includes(allHrefs[i])) {
      allHrefsWithoutDuplicates.push(allHrefs[i]);
    }
  }
  // ADD BASE URL FOR RELATIVE HREFS
  let allLinksOnThePage = [...allHrefsWithoutDuplicates];
  for (let i = 0; i < allLinksOnThePage.length; i++) {
    if (allLinksOnThePage[i][0] === '/') {
      const baseUrl = target.split('/').filter((el, ind) => ind < 3).join('/');
      allLinksOnThePage[i] = baseUrl + allLinksOnThePage[i];
    }
  }
  // SEND HTTP GET REQUEST TO CHECK IF RESOURSE EXISTS
  const brokenLinks = [];
  const brokenHrefs = [];
  const invalidUrls = [];
  for (let i = 0; i < allLinksOnThePage.length; i++) {
    try {
      // CHECK IF TARGET RESOURCE EXISTS USING HTTP GET REQUEST
      const response = await request.get(allLinksOnThePage[i]);
      if (response.status() === 404 || response.status() === 500) {
        console.log(allLinksOnThePage[i]);
        console.log(response.status());
        brokenLinks.push(allLinksOnThePage[i]);
        brokenHrefs.push(allHrefsWithoutDuplicates[i]);
      }
    } catch (error) { // invalid URL exception
      console.log(allLinksOnThePage[i]);
      console.log('invalid URL exception');
      invalidUrls.push(allLinksOnThePage[i]);
    }
  }
  console.log();
  console.log(`broken links: ${brokenLinks.length}`);
  console.log(brokenLinks);
  console.log();
  console.log('broken hrefs (to find elements in page sourse):');
  console.log(brokenHrefs);
  console.log();
  console.log('invalid URL exception (check manually):');
  console.log(invalidUrls);
  console.log();
  expect(brokenLinks.length, 'error - found broken links on the page').toBe(0);
});