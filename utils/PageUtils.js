export function createErrorObject(level, page, text, details) {
  return {
    level,
    page,
    text,
    details,
  };
}

export function attachConsoleErrorsListeners(page, pageConsoleErrors, pageJsErrors) {
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