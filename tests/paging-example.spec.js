const { test, expect } = require('@playwright/test');
const { getTextFromElement, getTextFromElements, clickOnElement } = require('../utils/WebElementUtils');

export async function clickOnPageNumber(page, pageNum) {
  const pageLocator = `//a[contains(@class,"paginate_button") and text()="${pageNum}"]`
  if ((await page.$$(pageLocator)).length === 0) {
    console.log(`page ${pageNum} not found, looks like no more pages`);
    return false;
  } else {
    console.log(`click on page: ${pageNum}`);
    await clickOnElement(page, pageLocator);
    // await page.waitForTimeout(500);
    return true;
  }
}

export async function getNumberOfResultsInTheCounterOnTheTop(page) {
  const locatorResultsCountSummary = '.dataTables_info'; // Showing 1 to 12 of 568 entries
  const resultsCountSummaryFullText = await getTextFromElement(page, locatorResultsCountSummary); // Showing 1 to 12 of 568 entries
  return +resultsCountSummaryFullText.split(' ').slice(-2)[0]; // get 568 from string
}

test(`paging test example`, async ({ page }) => {

  const locatorBankNames = '//tr/td[1]';
  await page.goto(`https://www.fdic.gov/resources/resolutions/bank-failures/failed-bank-list/index.html`);
  const tablePageSize = 12; // default is 12, but you can also add additional steps/tests for different page sizes

  const totalEntriesInitial = await getNumberOfResultsInTheCounterOnTheTop(page);
  const expectedTotalPages = Math.ceil(totalEntriesInitial / tablePageSize); // 48 pages

  const allBanksSet = new Set();
  const allBanksArray = [];

  for (let nextPageCounter = 2; nextPageCounter <= expectedTotalPages + 1; nextPageCounter++) {
    // bank names
    const banksOnOnePage = await getTextFromElements(page, locatorBankNames);
    console.log(`found ${banksOnOnePage.length} banks`);
    if (nextPageCounter < expectedTotalPages) {
      expect(banksOnOnePage.length === tablePageSize, 'each page except the last one should contain 12 entries').toBe(true);
    }
    banksOnOnePage.forEach(b => {
      if (allBanksArray.includes(b)) {
        console.log(`duplicate entry ${b}`);
      }
    });
    allBanksArray.push(...banksOnOnePage);
    banksOnOnePage.forEach(b => allBanksSet.add(b));
    // counter on the top
    const topCounterInIteration = await getNumberOfResultsInTheCounterOnTheTop(page);
    expect(topCounterInIteration, 'total entries amount on the top should remain the same during pagination').toBe(totalEntriesInitial);
    // paging
    if (!(await clickOnPageNumber(page, nextPageCounter))) {
      break;
    }
  }
  expect(allBanksArray.length, `amount of all banks in table is not the same as counter on the top`).toBe(totalEntriesInitial);
  // expect(allBanksSet.size, `amount of unique banks in table is not the same as counter on the top`).toBe(totalEntriesInitial);
  allBanksArray.forEach(b => {
    expect(b !== '', 'there shoud not be banks with empty name in the table').toBe(true);
  });
});