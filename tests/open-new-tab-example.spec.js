import { test } from '@playwright/test';

test(`open new tab example`, async ({ page, context }) => {
  console.log('OPEN TAB 1');
  await page.goto(`https://www.google.com`);
  await page.waitForTimeout(5000);

  console.log('OPEN TAB 2');
  const email = '8-7-2024_6-22-45_PM@yopmail.com';
  console.log(`open yopmail email = ${email}`);
  const page2 = await context.newPage();
  await page2.goto('https://yopmail.com/');
  const locatorYopmailEmailInput = '//input[@id="login"]';
  await page2.locator(locatorYopmailEmailInput).first().clear();
  await page2.locator(locatorYopmailEmailInput).first().type(email, { delay: 100 });
  await page2.locator(locatorYopmailEmailInput).press('Enter');
  await page2.waitForTimeout(10000);
  const locatorIFrameForCardNumber = '//iframe[@id="ifmail"]';
  const textContent = await (page2.frameLocator(locatorIFrameForCardNumber).locator('//*[contains(text(),"Or if you prefer, your verification code is")]')).textContent();
  const array = textContent.split(' ');
  const code = array[array.length - 1];
  console.log(`code in email = ${code}`);

  console.log('ENTER CODE TAKEN FROM TAB 2 IN TAB 1');
  const element = page.locator('[title="Search"]');
  await element.click();
  await element.clear();
  await element.type(code, { delay: 100 });
});