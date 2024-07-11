import { getTextFromElement, getTextFromElements } from '../utils/WebElementUtils';

class BestBuySearchResultsPage {

  constructor() {
    const page = process.playwrightPage;
    this.page = page;
    this.locatorProductLinks = '.sku-title a';
    this.locatorResultsCountOnTheTop = '.item-count';
    this.productLinks = this.page.locator(this.locatorProductLinks);
    this.productPrices = this.page.locator('//*[contains(@class,"sku-item")]//*[@data-testid="customer-price"]/span[1]');
  }

  async getProductNames() {
    await this.productLinks.first().waitFor({ state: 'visible' });
    const results = await getTextFromElements(this.locatorProductLinks);
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
