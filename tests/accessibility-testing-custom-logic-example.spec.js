import { expect, test } from '@playwright/test';
import { collectButtonsWithoutAriaLabel, collectImagesWithoutAltAttribute, collectInputsWithoutAriaLabel } from '../utils/AdaComplianceUtils';
import { savePageSource } from '../utils/FileUtils';
import { openUrl, scrollToBottom } from '../utils/PageUtils';
import { getDateAndTimeInString } from '../utils/StringUtils';

test.beforeEach(async ({ page, context, request }) => {
  process.playwrightPage = page;
  process.playwrightContext = context;
  process.playwrightRequest = request;
  console.log();
  console.log('Test started:', new Date().toLocaleString());
  console.log();
});

test.afterEach(async ({ page }) => {
  if (test.info().status === 'failed') {
    const pageSource = await page.content();
    const fileName = 'page_source_' + test.info().title.replace(/\s/g, '_').replace(/\//g, '_') + '_' + getDateAndTimeInString() + '.html';
    console.log(`writing failed page source to file - ${fileName}`);
    savePageSource(fileName, pageSource);
  }
});

export const pagesForADATesting = [
  'https://www.bestbuy.com/',
]

test(`Accessibility / ADA compliance testing - images alt, inputs aria-label`, async () => {
  let foundIssues = false;
  for (const url of pagesForADATesting) {
    await openUrl(`${url}`);
    await scrollToBottom(); // lazy loading on some pages, scroll to bottom to load all content
    const imagesWithoutAltAttribute = await collectImagesWithoutAltAttribute();
    const inputsWithoutAriaLabel = await collectInputsWithoutAriaLabel();
    const buttonsWithoutAriaLabel = await collectButtonsWithoutAriaLabel();
    if (imagesWithoutAltAttribute.length > 0 || inputsWithoutAriaLabel.length > 0 || buttonsWithoutAriaLabel.length > 0) {
      foundIssues = true;
    }
  }
  if (foundIssues) {
    expect(foundIssues, 'ada issues found - see details in the log').toBe(false);
  }
});