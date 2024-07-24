export async function openUrl(url) {
  console.log(`open url ${url}`);
  const page = process.playwrightPage;
  await page.goto(`${url}`);
}

export function getPageUrl() {
  const page = process.playwrightPage;
  if (page !== undefined) {
    return page.url();
  } else {
    return '';
  }
}

export async function scrollDown(pixels) {
  const page = process.playwrightPage;
  console.log(`scroll down ${pixels} pixels`);
  await page.mouse.wheel(0, pixels);
  await page.waitForTimeout(3000);
}

export async function scrollUp(pixels) {
  const page = process.playwrightPage;
  console.log(`scroll up ${pixels} pixels`);
  await page.mouse.wheel(0, -pixels);
  await page.waitForTimeout(3000);
}

export async function scrollToBottom() {
  const page = process.playwrightPage;
  console.log('scroll to the bottom of the page');
  await scrollDown(5000);
  await page.waitForTimeout(1000);
  await scrollDown(5000);
  await page.waitForTimeout(1000);
  await scrollDown(5000);
  await page.waitForTimeout(1000);
}

export async function waitSeconds(seconds) {
  const page = process.playwrightPage;
  await page.waitForTimeout(seconds * 1000);
}

export async function getPageSource() {
  const page = process.playwrightPage;
  const htmlContent = await page.content();
  return htmlContent;
}

export function createErrorObject(level, page, text, details) {
  return {
    level,
    page,
    text,
    details,
  };
}

export function attachConsoleErrorsListeners(pageConsoleErrors, pageJsErrors) {
  const page = process.playwrightPage;
  page.on('console', async message => {
    if (message.type() === 'error' || message.text().toLowerCase().includes('failed') || message.text().toLowerCase().includes('error')) {
      const entry = createErrorObject('console', page.url(), message.text(), message.location().url);
      pageConsoleErrors.push(entry);
    }
  });
  page.on('pageerror', async error => {
    const entry = createErrorObject('JS', page.url(), error, error?.stack);
    pageJsErrors.push(entry);
  });
  page.on('requestfailed', request => {
    const entry = createErrorObject('requestfailed', page.url(), request.url(), request?.failure()?.errorText);
    pageConsoleErrors.push(entry);
  });
}