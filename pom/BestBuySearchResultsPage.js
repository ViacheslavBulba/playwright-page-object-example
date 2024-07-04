import { getTextFromElements } from '../utils/WebElementUtils';

class BestBuySearchResultsPage {

  constructor() {
    const page = process.playwrightPage;
    this.page = page;
    this.locatorProductLinks = '.sku-title a';
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

}

export { BestBuySearchResultsPage };
