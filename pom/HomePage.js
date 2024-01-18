class HomePage {

  constructor(page) {
    this.url = 'https://www.bestbuy.com/';
    this.page = page;
    this.headerSearchInput = this.page.locator('.search-input');
    this.headerSearchButton = this.page.locator('.header-search-button');
    this.headerCartIcon = this.page.locator('.shop-cart-icon');
  }

  async open() {
    console.log(`open page ${this.url}`);
    await this.page.goto(this.url);
  }

  async search(text) {
    console.log(`search for [${text}] using search box on the top`);
    await this.headerSearchInput.waitFor({ state: 'visible' });
    await this.headerSearchInput.fill(text);
    await this.headerSearchInput.press('Enter');
  }

}

export { HomePage };
