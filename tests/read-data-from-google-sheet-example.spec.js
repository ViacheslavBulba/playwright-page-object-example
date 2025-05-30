import { test } from '@playwright/test';
import { googleSheetsApiKey } from '../utils/FileUtils';
const fetch = require("node-fetch");

// TODO npm install node-fetch@2 - to be able to run on Jenkins

async function readRowsFromGoogleSheet() {
  const spreadsheetId = '1syi2CFhLyVEgMdHVdHd1KdRhdiUj8FzofC3pdQo45DM';
  const googleSheetsApiKey = 'YOUR_GOOGLE_API_KEY';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1?key=${googleSheetsApiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('-----fetch response-----')
    console.log(data)
    // // Extract rows from the data
    console.log('-----data.values-----')
    const rows = data.values;
    console.log('rows:')
    rows.forEach(a => {
      console.log(a)
    });
    return rows;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
  }
}

test(`read data from google sheet example`, async ({ page }) => {
  const rows = await readRowsFromGoogleSheet();
});