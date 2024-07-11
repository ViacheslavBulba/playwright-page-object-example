import { expect, test } from '@playwright/test';
import { BestBuyHomePage } from '../pom/BestBuyHomePage';
import { BestBuySearchResultsPage } from '../pom/BestBuySearchResultsPage';
import { readDataFromExcelFile } from '../utils/readExcelSheetUtils';

test.beforeEach(async ({ page, context, request }) => {
  process.playwrightPage = page;
  process.playwrightContext = context;
  process.playwrightRequest = request;
});

const ExcelDataProvider = readDataFromExcelFile('excel-data-provider.xlsx');

test.beforeAll(async () => {
  console.log(ExcelDataProvider);
})

for (const lineFromExcel of ExcelDataProvider) {
  test(`best buy search test - read test data from excel - ${lineFromExcel.productToSearch} - ${lineFromExcel.amountOfResults}`, async ({ page }) => {
    const productToSearch = lineFromExcel.productToSearch;
    const expectedAmountOfResultsFromExcel = +lineFromExcel.amountOfResults;
    const bestBuyHomePage = new BestBuyHomePage();
    await bestBuyHomePage.open();
    await bestBuyHomePage.search(productToSearch);
    const bestBuySearchResultsPage = new BestBuySearchResultsPage();
    const resultsOnTheTop = await bestBuySearchResultsPage.getAmountOfResultsOnTheTop();
    console.log('exact number of results will keep changing based on new products availability, so here we can check that it is >= N/2 and <= N*2');
    const min = Math.floor(expectedAmountOfResultsFromExcel / 2);
    const max = expectedAmountOfResultsFromExcel * 2;
    expect(resultsOnTheTop).toBeGreaterThan(min);
    expect(resultsOnTheTop).toBeLessThan(max);
  });
}