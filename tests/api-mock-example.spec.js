import { expect, test } from '@playwright/test';
import { BestBuyHomePage } from '../pom/BestBuyHomePage';
import { BestBuySearchResultsPage } from '../pom/BestBuySearchResultsPage';
import { targetProductResponseMock } from '../test-data/target-product-mock.json.data';
import { bestBuyPdpMock } from '../test-data/best-buy-pdp-mock.json.data';
import { logToConsoleAndOutputFile } from '../utils/FileUtils';

test.beforeEach(async ({ page, context, request }) => {
  process.playwrightPage = page;
  process.playwrightContext = context;
  process.playwrightRequest = request;
});

export function getDateAndTimeInString() {
  return (new Date()).toLocaleString().replace(/(:|\/)/g, '-').replace(/,/g, '').replace(/\s/g, '_');
}

const fileNameToProduce = 'api_requests_' + getDateAndTimeInString() + '.txt';

// test.beforeEach(async ({ page }) => {
//   let requestsCount = 0;
//   logToConsoleAndOutputFile('Start time: ' + new Date().toLocaleString(), fileNameToProduce);
//   // await page.route('**/orchestrationservices/**', async route => {
//   // await page.route('**/**', async route => {
//   // await page.route('', async route => {
//   // */**/
//   // await page.route('*/**', async route => {
//   // await page.route('*', async route => {
//   // await page.route('*/*', async route => {
//   await page.route('*nuskin.com/*', async route => {
//     // const response = await route.fetch({ timeout: 120000 });
//     const response = await route.fetch();
//     logToConsoleAndOutputFile(route.request().url(), fileNameToProduce);
//     const json = await response.json();
//     logToConsoleAndOutputFile('-------------- REQUEST COUNT -------------------', fileNameToProduce);
//     logToConsoleAndOutputFile(++requestsCount, fileNameToProduce);
//     logToConsoleAndOutputFile('------------------------------------------------', fileNameToProduce);
//     // https://storefront.api.test.nuskin.com/orchestrationservices/storefront/carts/USER?locale=en_US&storeId=430
//     if (route.request().url().includes('/orchestrationservices/storefront/carts/USER?locale=')) {
//       // if (route.request().method() === 'GET') {
//       //   if (json.code) {
//       //     validateSchema(json, 'code-message-timestamp.schema.json');
//       //   } else {
//       //     validateSchema(json, 'carts-user-get.schema.json');
//       //   }
//       // } else if (route.request().method() === 'PATCH') {
//       //   validateSchema(json, 'carts-user-patch.schema.json');
//       // } else {
//       //   expect.soft(true, 'SUCH HTTP METHOD IS NOT ADDED TO SCHEMA VALIDATOR').toBe(false);
//       // }
//     }
//     else {
//       logToConsoleAndOutputFile('-------------- NEW REQUEST -------------------', fileNameToProduce);
//       logToConsoleAndOutputFile(route.request().url(), fileNameToProduce);
//       logToConsoleAndOutputFile('----------------------------------------------', fileNameToProduce);
//       logToConsoleAndOutputFile(route.request().method(), fileNameToProduce);
//       logToConsoleAndOutputFile('----------------------------------------------', fileNameToProduce);
//       logToConsoleAndOutputFile(JSON.stringify(json), fileNameToProduce);
//       logToConsoleAndOutputFile('----------------------------------------------', fileNameToProduce);
//       logToConsoleAndOutputFile(route.request().url(), fileNameToProduce);
//       logToConsoleAndOutputFile('----------------------------------------------', fileNameToProduce);
//     }
//     await route.fulfill({ response, json });
//   });
// });

// test('api mock example', async ({ page }) => {
//   // **/graphql
//   // **/orchestra/snb/graphql/Search/**
//   await page.route(`**/graphql`, async route => {
//     // "https://www.walmart.com/orchestra/snb/graphql/Search/f3a42fb9aca92b4364c20449ee31c5e63d0012e4054580489ebc4084d92fd407/search?variables=%7B%22id%22%3A%22%22%2C%22dealsId%22%3A%22%22%2C%22query%22%3A%22lenovo%22%2C%22page%22%3A1%2C%22prg%22%3A%22desktop%22%2C%22catId%22%3A%22%22%2C%22facet%22%3A%22%22%2C%22sort%22%3A%22best_match%22%2C%22rawFacet%22%3A%22%22%2C%22seoPath%22%3A%22%22%2C%22ps%22%3A40%2C%22limit%22%3A40%2C%22ptss%22%3A%22%22%2C%22trsp%22%3A%22%22%2C%22beShelfId%22%3A%22%22%2C%22recall_set%22%3A%22%22%2C%22module_search%22%3A%22%22%2C%22min_price%22%3A%22%22%2C%22max_price%22%3A%22%22%2C%22storeSlotBooked%22%3A%22%22%2C%22additionalQueryParams%22%3A%7B%22hidden_facet%22%3Anull%2C%22translation%22%3Anull%2C%22isMoreOptionsTileEnabled%22%3Atrue%2C%22isGenAiEnabled%22%3Atrue%7D%2C%22searchArgs%22%3A%7B%22query%22%3A%22lenovo%22%2C%22cat_id%22%3A%22%22%2C%22prg%22%3A%22desktop%22%2C%22facet%22%3A%22%22%7D%2C%22fitmentFieldParams%22%3A%7B%22powerSportEnabled%22%3Atrue%2C%22dynamicFitmentEnabled%22%3Atrue%2C%22extendedAttributesEnabled%22%3Afalse%7D%2C%22fitmentSearchParams%22%3A%7B%22id%22%3A%22%22%2C%22dealsId%22%3A%22%22%2C%22query%22%3A%22lenovo%22%2C%22page%22%3A1%2C%22prg%22%3A%22desktop%22%2C%22catId%22%3A%22%22%2C%22facet%22%3A%22%22%2C%22sort%22%3A%22best_match%22%2C%22rawFacet%22%3A%22%22%2C%22seoPath%22%3A%22%22%2C%22ps%22%3A40%2C%22limit%22%3A40%2C%22ptss%22%3A%22%22%2C%22trsp%22%3A%22%22%2C%22beShelfId%22%3A%22%22%2C%22recall_set%22%3A%22%22%2C%22module_search%22%3A%22%22%2C%22min_price%22%3A%22%22%2C%22max_price%22%3A%22%22%2C%22storeSlotBooked%22%3A%22%22%2C%22additionalQueryParams%22%3A%7B%22hidden_facet%22%3Anull%2C%22translation%22%3Anull%2C%22isMoreOptionsTileEnabled%22%3Atrue%2C%22isGenAiEnabled%22%3Atrue%7D%2C%22searchArgs%22%3A%7B%22query%22%3A%22lenovo%22%2C%22cat_id%22%3A%22%22%2C%22prg%22%3A%22desktop%22%2C%22facet%22%3A%22%22%7D%2C%22cat_id%22%3A%22%22%2C%22_be_shelf_id%22%3A%22%22%7D%2C%22enableFashionTopNav%22%3Afalse%2C%22enableRelatedSearches%22%3Atrue%2C%22enablePortableFacets%22%3Atrue%2C%22enableFacetCount%22%3Atrue%2C%22fetchMarquee%22%3Atrue%2C%22fetchSkyline%22%3Atrue%2C%22fetchGallery%22%3Afalse%2C%22fetchSbaTop%22%3Atrue%2C%22fetchDac%22%3Afalse%2C%22tenant%22%3A%22WM_GLASS%22%2C%22enableMultiSave%22%3Afalse%2C%22enableSellerType%22%3Afalse%2C%22enableAdditionalSearchDepartmentAnalytics%22%3Afalse%2C%22enableFulfillmentTagsEnhacements%22%3Afalse%2C%22enableRxDrugScheduleModal%22%3Afalse%2C%22enablePromoData%22%3Afalse%2C%22pageType%22%3A%22SearchPage%22%7D",
//     const json = targetProductResponseMock;
//     await route.fulfill({ json });
//   });

//   await page.goto('https://www.walmart.com/search?q=lenovo');
//   await page.waitForTimeout(5000);
//   // await page.close();
// });

test('api mock example 2 best buy pdp', async ({ page }) => {
  // "url": "https://www.bestbuy.com/pricing/v1/price/item?allFinanceOffers=true&catalog=bby&context=offer-list&effectivePlanPaidMemberType=NULL&includeOpenboxPrice=true&paidMemberSkuInCart=false&salesChannel=LargeView&skuId=6447382&useCabo=true&usePriceWithCart=true&visitorId=7432b9bb-415d-11ef-986c-02c58d18160d",
  // await page.route(`**/pricing/v1/price/item/**`, async route => {
  //   const json = bestBuyPdpMock;
  //   await route.fulfill({ json });
  // });

  // await page.goto('https://www.bestbuy.com/site/apple-airpods-pro-2nd-generation-with-magsafe-case-usbc-white/6447382.p?skuId=6447382');
  // await page.waitForTimeout(5000);

  await page.goto('https://www.nuskin.com/us/en/search/body%20bar');
  await page.waitForTimeout(5000);
  // await page.close();
});

test('api mock example 3 github from har file', async ({ page }) => {
  // "url": "https://www.bestbuy.com/pricing/v1/price/item?allFinanceOffers=true&catalog=bby&context=offer-list&effectivePlanPaidMemberType=NULL&includeOpenboxPrice=true&paidMemberSkuInCart=false&salesChannel=LargeView&skuId=6447382&useCabo=true&usePriceWithCart=true&visitorId=7432b9bb-415d-11ef-986c-02c58d18160d",
  // await page.route(`**/pricing/v1/price/item/**`, async route => {
  //   const json = bestBuyPdpMock;
  //   await route.fulfill({ json });
  // });

  // await page.goto('https://www.bestbuy.com/site/apple-airpods-pro-2nd-generation-with-magsafe-case-usbc-white/6447382.p?skuId=6447382');
  // await page.waitForTimeout(5000);

  await page.goto('https://www.nuskin.com/us/en/search/body%20bar');
  await page.waitForTimeout(5000);
  // await page.close();
});