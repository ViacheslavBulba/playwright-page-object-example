class BestBuyHomePage {

  constructor() {
    this.url = 'https://www.bestbuy.com/';
    const page = process.playwrightPage;
    this.page = page;
    this.headerSearchInput = this.page.locator('.search-input, #autocomplete-search-bar');
    this.headerSearchButton = this.page.locator('.header-search-button');
    this.headerCartIcon = this.page.locator('.shop-cart-icon');
  }

  async open() {
    console.log(`open page ${this.url}`);
    await this.page.goto(this.url);
    await this.page.waitForTimeout(5000);
  }

  async search(text) {
    console.log(`search for [${text}] using search box on the top`);
    await this.headerSearchInput.waitFor({ state: 'visible' });
    await this.headerSearchInput.fill(text);
    await this.headerSearchInput.press('Enter');
  }

}

export { BestBuyHomePage };
