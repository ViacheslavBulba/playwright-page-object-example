import { getTextFromElement, getTextFromElements } from '../utils/WebElementUtils';

class BestBuySearchResultsPage {

  constructor() {
    const page = process.playwrightPage;
    this.page = page;
    this.locatorProductLinks = 'a.product-list-item-link';
    this.locatorProductNames = '.product-title';
    this.locatorProductImages = '.product-image';
    this.locatorResultsCountOnTheTop = '.item-count';
    this.productLinks = this.page.locator(this.locatorProductLinks);
    this.productImages = this.page.locator(this.locatorProductImages);
    this.productPrices = this.page.locator('//*[contains(@class,"sku-item")]//*[@data-testid="customer-price"]/span[1]');
  }

  async getProductNames() {
    await this.page.waitForTimeout(5000);
    const results = await getTextFromElements(this.locatorProductNames);
    console.log('found product names:');
    console.log(results);
    return results;
  }

  async getAmountOfResultsOnTheTop() {
    await this.page.locator(this.locatorResultsCountOnTheTop).waitFor({ state: 'visible' });
    const itemsText = await getTextFromElement(this.locatorResultsCountOnTheTop);
    console.log(`${itemsText}`);
    return +itemsText.split(' ')[0];
  }

}

export { BestBuySearchResultsPage };
