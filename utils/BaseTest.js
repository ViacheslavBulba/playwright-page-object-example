import { test } from '@playwright/test';
import * as fs from 'fs';
import path from 'path';
import { getDate, getDateAndTimeInString } from './StringUtils.js';

let CustomTest = test.extend({

  page: async ({ page }, use, testResults) => {

    await use(page); // run the callback function passing the 'page' object to underlying tests

    // write results to file system
    let testName = testResults.title;
    let status = (testResults.status).toLowerCase();
    if (status !== 'interrupt') {
      const dateForFileName = getDate();
      let fileName = 'results_' + dateForFileName + '.txt';
      const folder = 'test_results_files';
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      }
      testName = `${testName}`.replace(/,/g, '');
      fs.appendFileSync(folder + path.sep + fileName, `${testName} - ${status} - ${getDateAndTimeInString()}\n`, 'utf8');
    }
  },
});

CustomTest.beforeAll(async () => {
  // add some logic if needed
});

CustomTest.beforeEach(async ({ page, context, browser, request }) => {
  process.playwrightPage = page;
  process.playwrightContext = context;
  process.playwrightBrowser = browser;
  process.playwrightRequest = request;
  console.log();
  console.log('Test started:', new Date().toLocaleString());
  console.log();
  // SET COOKIES AND ADDITIONAL ACTIONS IF NEEDED
});

CustomTest.afterEach(async ({ page }, testInfo) => {
  console.log('');
  console.log('Test finished: ' + new Date().toLocaleString());
  console.log('');
  if (testInfo.status === 'failed') {
    console.log('URL at the moment of failure = ' + page.url());
    console.log('');
  }
});

export {
  CustomTest
};