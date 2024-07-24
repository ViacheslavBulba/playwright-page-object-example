import { expect } from '@playwright/test';
import { waitSeconds } from './PageUtils';

export async function getTextFromElements(locator) {
  const page = process.playwrightPage;
  const elements = await page.locator(locator).all();
  const texts = [];
  for (let el of elements) {
    texts.push((await el.textContent()).trim());
  }
  return texts;
}

export async function getNumberOfElements(locator) {
  const page = process.playwrightPage;
  return await page.locator(locator).count();
}

export async function isElementPresent(locator) {
  const page = process.playwrightPage;
  return await page.locator(locator).count() > 0;
}

export async function getTextFromElement(locator) {
  const page = process.playwrightPage;
  let result = '';
  if (await isElementPresent(locator)) {
    const textContent = await (await page.$(locator)).textContent();
    result = textContent.trim().replace(/\n/g, ' ');
  }
  return result;
}

export async function clickOnElement(locator) {
  const page = process.playwrightPage;
  await page.locator(locator).first().click({ position: { x: 1, y: 1 } });
}

export async function assertTextIsPresent(text) {
  const page = process.playwrightPage;
  console.log(`assert text [${text}] is present on the page`);
  const textFound = await page.locator(`//*[contains(text(),"${text}")]`).count() > 0;
  expect(textFound, `Cannot find text [${text}] on the page ${page.url()}`).toBe(true);
}

export async function assertTextEqualsIsPresent(text) {
  const page = process.playwrightPage;
  console.log(`assert text equals [${text}] is present`);
  if (page.url().includes('/en')) {
    let textFound = false;
    if (await getNumberOfElements(`//*[text()='${text}']`) > 0) {
      textFound = true;
    }
    if (await getNumberOfElements(`//*[@tooltipinfo='${text}']`) > 0) {
      textFound = true;
    }
    if (await getNumberOfElements(`//*[@aria-label='${text}']`) > 0) {
      textFound = true;
    }
    expect(textFound, `Cannot find text [${text}]`).toBe(true);
  } else {
    console.log(`for non /en locales checking text is skipped`)
  }
}

export async function clickOnText(text) {
  const page = process.playwrightPage;
  console.log(`click on text [${text}]`);
  const locatorTextEquals = `//*[text()="${text}"]`;
  const locatorValueEquals = `//*[@value="${text}"]`;
  const locatorTextContains = getLocatorContainsText(text);
  if (await getNumberOfElements(locatorTextEquals) > 0) {
    await page.locator(locatorTextEquals).first().click();
  } else if (await getNumberOfElements(locatorValueEquals) > 0) {
    await page.locator(locatorValueEquals).first().click();
  } else if (await getNumberOfElements(locatorTextContains) > 0) {
    await page.locator(locatorTextContains).first().click();
  } else {
    expect(false, `Cannot find text [${text}]`).toBe(true);
  }
}

export async function clickOnTextEqualsIfPresent(text) {
  if (await isTextEqualsPresent(text)) {
    await clickOnText(text);
    await waitSeconds(1);
  }
}

export async function clickOnTextContainsIfPresent(text) {
  if (await isTextContainsVisible(text)) {
    await clickOnText(text);
    await waitSeconds(1);
  }
}

export async function clickOnLink(text) {
  const page = process.playwrightPage;
  console.log(`click on link by exact text [${text}]`);
  let locator = `//a[text()="${text}"]`;
  if (!(await isElementDisplayed(locator))) {
    console.log(`[${locator}] - is not visible, trying a/span`)
    locator = `//a/span[text()="${text}"]`;
  }
  await clickOnElement(locator);
}

export async function clickOnButton(text) {
  const page = process.playwrightPage;
  console.log(`click on button [${text}]`);
  const locator = `//button[text()='${text}']`;
  if (await getNumberOfElements(locator) > 0) {
    await page.locator(locator).first().click();
  } else {
    expect(false, `Cannot find button [${text}]`).toBe(true);
  }
}

export function getLocatorContainsText(text) {
  let locator = `//*[contains(text(),"${text}")]`;
  if (text.includes('"')) {
    locator = `//*[contains(text(),'${text}')]`;
  }
  return locator;
}

export async function waitForText(text, seconds) {
  const page = process.playwrightPage;
  if (seconds === undefined) {
    seconds = 15; // if seconds value is not passed, take 15 as default
  }
  if (page.url().includes('/en')) {
    console.log(`wait for text "${text}" on the page ${page.url()}`);
    const locator = getLocatorContainsText(text);
    await waitForElementToBeAttached(locator, seconds);
  } else {
    console.log(`since locale is not En - skip waiting for specific ${text} and just wait ${seconds} seconds`);
    await page.waitForTimeout(seconds * 1000);
  }
}

export async function waitForAnyText(textArray, seconds) {
  const page = process.playwrightPage;
  console.log(`wait for any text: "${textArray}"`);
  if (seconds === undefined) {
    seconds = 15; // if seconds value is not passed, take 15 as default
  }
  let locator = `//*[contains(text(),"${textArray[0]}")]`;
  if (textArray.length > 1) {
    let locatorMiddle = `contains(text(),"${textArray[0]}")`;
    for (let i = 1; i < textArray.length; i++) {
      locatorMiddle = locatorMiddle + ' or ' + `contains(text(),"${textArray[i]}")`
    }
    locator = `//*[${locatorMiddle}]`;
  }
  console.log(locator);
  await waitForElementToBeAttached(locator, seconds);
}

export async function waitForElementToBeAttached(locator, seconds) {
  const page = process.playwrightPage;
  console.log(`wait for element to be attached - ${locator}`);
  try {
    const ele = await page.locator(locator).first();
    await ele.waitFor({ state: "attached", timeout: seconds * 1000 }); // wait for element to be present in DOM, not all elements are considered as visible
  } catch (error) {
    console.log(`DEBUG - element was not attached - ${locator}`);
  }
}

export async function waitForElement(locator, seconds) {
  let found = false;
  const page = process.playwrightPage;
  for (let timerCount = 0; timerCount < seconds * 10; timerCount++) {
    if (await getNumberOfElements(locator) > 0) {
      found = true;
      return true;
    } else {
      await page.waitForTimeout(100);
    }
  }
  return found;
}

export async function waitForAnyElementFromFew(locatorsArray, seconds) {
  const page = process.playwrightPage;
  console.log(`waiting for any of elements [${locatorsArray}] within ${seconds} seconds`);
  for (let timerCount = 0; timerCount / 10 < seconds; timerCount++) {
    for (const locator of locatorsArray) {
      if (await getNumberOfElements(locator) > 0) {
        return;
      } else {
        await page.waitForTimeout(100);
      }
    }
  }
  expect(false, `Cannot find any of locators ${locatorsArray} within ${seconds} seconds`).toBe(true);
}

export async function waitForUrlToChange(initial, seconds) {
  const page = process.playwrightPage;
  console.log(`waiting for page url to change, initial url - ${initial}`);
  for (let timerCount = 0; timerCount / 10 < seconds; timerCount++) {
    const current = page.url();
    if (current !== initial) {
      return;
    } else {
      await page.waitForTimeout(100);
    }
  }
}

export async function isTextEqualsPresent(text) {
  const page = process.playwrightPage;
  const locator = `//*[text()="${text}"]`;
  return await getNumberOfElements(locator) > 0;
}

export async function isTextContainsPresent(text) {
  const page = process.playwrightPage;
  console.log(`isTextContainsPresent = ${text}`);
  const locator = getLocatorContainsText(text);
  console.log(await getNumberOfElements(locator) > 0);
  return (await getNumberOfElements(locator) > 0);
}

export async function isTextContainsVisible(text) {
  const page = process.playwrightPage;
  const locator = getLocatorContainsText(text);
  let visibility = false;
  if (await getNumberOfElements(locator) > 0) {
    visibility = await (await page.$(locator)).isVisible();
  }
  return visibility;
}

export async function assertIsElementDisplayed(locator) {
  const page = process.playwrightPage;
  let visibility = false;
  if (await getNumberOfElements(locator) > 0) {
    visibility = await (await page.$(locator)).isVisible();
  }
  expect(visibility, `Cannot find element [${locator}] on the page ${page.url()}`).toBe(true);
}

export async function IsAtLeastOneOfManyElementsVisible(locator) {
  const page = process.playwrightPage;
  let visibility = false;
  const elements = await page.locator(locator).all();
  for (let el of elements) {
    visibility = await el.isVisible();
    if (visibility) {
      break;
    }
  }
  return visibility;
}

export async function assertTextEqualsIsVisible(text) {
  console.log(`assert text equals [${text}] is visible`);
  let locator = `//*[normalize-space(text())='${text}']`;
  let visibility = false;
  visibility = await IsAtLeastOneOfManyElementsVisible(locator);
  if (!visibility) {
    locator = `//*[text()="${text}"]`;
    visibility = await IsAtLeastOneOfManyElementsVisible(locator);
  }
  if (!visibility) {
    locator = `//*[@value="${text}"]`;
    visibility = await IsAtLeastOneOfManyElementsVisible(locator);
  }
  if (!visibility) {
    locator = `//*[@placeholder="${text}"]`;
    visibility = await IsAtLeastOneOfManyElementsVisible(locator);
  }
  expect(visibility, `Cannot find text [${text}]`).toBe(true);
}

export async function assertTextEqualsIsNotVisible(text) {
  const page = process.playwrightPage;
  console.log(`assert text equals [${text}] is missing`);
  let locator = `//*[normalize-space(text())='${text}']`;
  let visibility = false;
  visibility = await IsAtLeastOneOfManyElementsVisible(locator);
  if (!visibility) {
    locator = `//*[@value="${text}"]`;
    visibility = await IsAtLeastOneOfManyElementsVisible(locator);
  }
  expect(visibility, `Text [${text}] should not be visible on the page`).toBe(false);
}

export async function assertTextContainsIsVisible(text) {
  const page = process.playwrightPage;
  console.log(`check text contains [${text}] is visible on the page [${page.url()}]`);
  let locatorTextContains = getLocatorContainsText(text);
  if ((await page.getByText(`${text}`).all()).length > 0) {
    const allElements = await page.getByText(`${text}`).all();
    let visible = false;
    for (const element of allElements) {
      if (await element.isVisible()) {
        visible = true;
        break;
      }
    }
    expect(visible, `assert text contains is visible = [${text}]`).toBe(true);
  } else if (await getNumberOfElements(locatorTextContains) > 0) {
    let visibility = await IsAtLeastOneOfManyElementsVisible(locatorTextContains);
    expect(visibility, `assert text contains is visible = [${text}]`).toBe(true);
  } else {
    let locator = `//*[@value="${text}"]`;
    if (text.includes('"')) {
      locator = `//*[@value='${text}']`;
    }
    let visibility = await IsAtLeastOneOfManyElementsVisible(locator);
    expect(visibility, `assert text contains is visible = [${text}]`).toBe(true);
  }
}

export async function assertTextContainsIsNotVisible(text) {
  const page = process.playwrightPage;
  console.log(`check that the text is not displayed - ${text}`);
  const locator = getLocatorContainsText(text);
  let visibility = false;
  if (await getNumberOfElements(locator) > 0) {
    visibility = await (await page.$(locator)).isVisible();
  }
  expect(visibility, `Text [${text}] should not be visible on the page`).toBe(false);
}

export async function assertTextContainsIsNotPresent(text) {
  const page = process.playwrightPage;
  console.log(`check that text contains [${text}] is missing`);
  const locator = getLocatorContainsText(text);
  const entries = await getNumberOfElements(locator);
  expect(entries === 0, `Text [${text}] should not be found on the page`).toBe(true);
}

export async function assertTextContainsIsPresent(text) { // do not check for visibility, for presence only, for some elements Playwright returns visibility = false
  console.log(`assert text contains is present - [${text}]`);
  const page = process.playwrightPage;
  const locatorTextEquals = `//*[text()="${text}"]`;
  const locatorValueEquals = `//*[@value="${text}"]`;
  const locatorValueContains = `//*[contains(@value,"${text}")]`
  const locatorTextContains = getLocatorContainsText(text);
  let textFound = false;
  if (await getNumberOfElements(locatorTextEquals) > 0) {
    textFound = true;
  } else if (await getNumberOfElements(locatorValueEquals) > 0) {
    textFound = true;
  } else if (await getNumberOfElements(locatorTextContains) > 0) {
    textFound = true;
  } else if (await getNumberOfElements(locatorValueContains) > 0) {
    textFound = true;
  } else {
    expect(textFound, `Cannot find text [${text}] on the page ${page.url()}`).toBe(true);
  }
}

export async function assertTextInElement(locator, expectedValue) {
  const page = process.playwrightPage;
  console.log(`assert text [${expectedValue}] in element [${locator}]`);
  const actualValue = await page.locator(locator).first().textContent();
  expect(actualValue.trim().replace(/\n/g, ' '), `assert text [${expectedValue}] in locator [${locator}]`).toBe(expectedValue);
}

export async function getTextFromFirstVisibleElement(locator) {
  const page = process.playwrightPage;
  let visibility = false;
  const elements = await page.locator(locator).all();
  // console.log(`found ${elements.length} elements`);
  for (let el of elements) {
    visibility = await el.isVisible();
    if (visibility) {
      const textContent = await el.textContent();
      return textContent.trim().replace(/\n/g, ' ');
    }
  }
  return '';
}

export async function getValueFromInput(locator) {
  const page = process.playwrightPage;
  console.log(`get value from input - ${locator}`);
  await waitForElement(locator, 5);
  if ((await page.$(locator)) === null) {
    expect(false, `cannot find input ${locator}`).toBe(true);
  }
  const result = await (await page.$(locator)).getAttribute('value');
  console.log(`value in input ${locator} = [${result}]`);
  return result;
}

export async function getTypeFromInput(locator) {
  const page = process.playwrightPage;
  console.log(`get type from input - ${locator}`);
  await waitForElement(locator, 5);
  const result = await (await page.$(locator)).getAttribute('type');
  return result;
}

export async function assertValueWithTextBefore(textBefore, expectedValue) {
  const page = process.playwrightPage;
  console.log(`assert value with text before [${textBefore}] = [${expectedValue}]`);
  await assertTextInElement(page, `//*[text()="${textBefore}"]/following::span[1]`, expectedValue);
}

export async function assertValueInInput(locator, expectedValue) {
  const page = process.playwrightPage;
  const actualValue = await (await page.$(locator)).getAttribute('value');
  expect(actualValue.trim()).toBe(expectedValue.toString());
}

export async function assertElementVisibility(locator, expectedVisibility) {
  const page = process.playwrightPage;
  // console.log(`assert visibility for [${locator}] = [${expectedVisibility}]`);
  let visibility = false;
  if (await getNumberOfElements(locator) > 0) {
    visibility = await (await page.$(locator)).isVisible();
  }
  expect(visibility, `unexpected visibility for element with locator ${locator}`).toBe(expectedVisibility);
}

export async function assertElementIsNotDisplayed(locator) {
  await assertElementVisibility(locator, false);
}

export async function assertElementIsDisplayed(locator) {
  await assertElementVisibility(locator, true);
}

export async function getAttributeFromElements(locator, attribute) {
  const page = process.playwrightPage;
  const elements = await page.locator(locator).all();
  const values = [];
  for (let el of elements) {
    let attr = await el.getAttribute(attribute);
    if (attr === null) {
      attr = '';
    }
    values.push(attr);
  }
  return values;
}

export async function waitForTextInElementToBeChanged(locator, initialText, seconds) {
  const page = process.playwrightPage;
  console.log(`waiting text in element [${locator}] to be changed to something other than [${initialText}] within ${seconds} seconds`);
  for (let timerCount = 0; timerCount / 2 < seconds; timerCount++) {
    const actualText = await getTextFromElement(locator);
    if (actualText !== initialText) {
      return;
    } else {
      await page.waitForTimeout(500);
    }
  }
  console.log(`text in element [${locator}] has not been changed from [${initialText}] within ${seconds} seconds`);
}

export async function waitForTextToDisappear(text, seconds) {
  const page = process.playwrightPage;
  console.log(`waiting for text [${text}] to disappear within ${seconds} seconds`);
  for (let timerCount = 0; timerCount / 2 < seconds; timerCount++) {
    const locatorTextContains = getLocatorContainsText(text);
    if (await getNumberOfElements(locatorTextContains) === 0) {
      return;
    } else {
      await page.waitForTimeout(500);
    }
  }
  console.log(`text [${text}] did not disappear within ${seconds} seconds`);
}

export async function waitForElementToDisappear(locator, seconds) {
  const page = process.playwrightPage;
  if (seconds === undefined) {
    seconds = 15; // if seconds value is not passed, take 15 as default
  }
  console.log(`waiting for [${locator}] to disappear within ${seconds} seconds`);
  for (let timerCount = 0; timerCount / 2 < seconds; timerCount++) {
    if (await getNumberOfElements(locator) === 0) {
      // console.log(`element not found, no wait`);
      console.log(`element is not present, end wait`);
      return;
    } else {
      await page.waitForTimeout(500);
    }
  }
  console.log(`element [${locator}] did not disappear within ${seconds} seconds, exit wait`);
}

export async function waitForTextInElement(locator, text, seconds) {
  const page = process.playwrightPage;
  console.log(`waiting for text in element [${locator}] to be [${text}]`);
  for (let timerCount = 0; timerCount / 2 < seconds; timerCount++) {
    const textContent = await page.locator(locator).last().textContent();
    if (textContent === text) {
      return;
    } else {
      await page.waitForTimeout(500);
    }
  }
  console.log(`text in element [${locator}] has not been changed to [${text}] within ${seconds} seconds`);

}

export async function waitForElementToAppearAndDisappear(locator, seconds) {
  console.log(`wait for [${locator}] to appear and disappear`);
  const page = process.playwrightPage;
  if (seconds === undefined) {
    seconds = 15; // if seconds value is not passed, take 15 as default
  }
  if (locator === locatorLoadingSpinner) {
    if (!(await waitForElement(locator, 5))) {
      console.log('loading spinner did not appear within first 5 seconds');
      return;
    }
  }
  const element = await page.locator(locator).first();
  try {
    await element.waitFor({ state: "attached", timeout: seconds * 1000 });
    await element.waitFor({ state: "detached", timeout: seconds * 1000 });
  } catch (error) {
    console.log(`INFO - element was not attached / detached - ${locator}`);
  }
}

export async function enterTextInElement(locator, text) {
  const page = process.playwrightPage;
  const element = page.locator(locator).last();
  await element.click();
  await element.clear();
  await element.type(text, { delay: 100 });
}

export async function enterTextInElementAndPressEnter(locator, text) {
  const page = process.playwrightPage;
  const element = page.locator(locator).last();
  await element.click();
  await element.clear();
  await element.type(text, { delay: 100 });
  await element.press('Enter');
  await waitSeconds(1);
}

export async function getValuesFromInputs(locator) {
  const values = await getAttributeFromElements(locator, 'value');
  console.log(values);
  return values;
}

export async function assertOneOfElementsHasText(locator, text) {
  const page = process.playwrightPage;
  console.log('text content array');
  const textsArray = await getTextFromElements(locator);
  if (textsArray.includes(text)) {
    return;
  }
  console.log('input values array');
  const valuesArray = await getValuesFromInputs(locator);
  if (valuesArray.includes(text)) {
    return;
  }
  expect(false, `Cannot find text ${text} in elements [${locator}]`).toBe(true);
}

export async function assertThereIsNoInputWithValue(text) {
  const page = process.playwrightPage;
  const valuesArray = await getValuesFromInputs('//input');
  if (!valuesArray.includes(text)) {
    return;
  }
  expect(false, `There should not be an input with text ${text} on the page`).toBe(true);
}

export async function clickOnFirstVisibleElement(locator) {
  const page = process.playwrightPage;
  const elements = await page.locator(locator).all();
  let i = 1;
  for (let el of elements) {
    const isVisible = await el.isVisible();
    if (isVisible) {
      await el.click();
      return;
    } else {
      console.log(`${i} instance not visible`);
      i++;
    }
  }
  expect(false, `Cannot find and click on visible [${locator}]`).toBe(true);
}

export async function clickOnAllVisibleElements(locator) {
  const page = process.playwrightPage;
  const elements = await page.locator(locator).all();
  let i = 1;
  for (let el of elements) {
    const isVisible = await el.isVisible();
    if (isVisible) {
      await el.click({ position: { x: 1, y: 1 } });
      console.log(`instance [${i}] of [${locator}] is visible, clicked`);
    } else {
      console.log(`instance [${i}] of [${locator}] is not visible, skip`);
      i++;
    }
  }
}

export async function clickOnElementForce(locator) {
  const page = process.playwrightPage;
  await page.locator(locator).first().click({ force: true });
}

export async function clickOnElementIfPresent(locator) {
  if (await isElementPresent(locator)) {
    await clickOnElement(locator);
  }
}

export async function fillValue(locator, value) {
  const page = process.playwrightPage;
  await page.locator(locator).fill(value);
}

export async function selectOptionInDropdown(locator, option) {
  const page = process.playwrightPage;
  await page.locator(locator).selectOption(option);
}

export async function hoverOverElement(locator) {
  const page = process.playwrightPage;
  await page.locator(locator).first().hover({ force: true });
}

export async function hoverOverText(text) {
  console.log(`hover over text ${text}`);
  const page = process.playwrightPage;
  const locatorTextContains = getLocatorContainsText(text);
  await page.locator(locatorTextContains).first().hover();
}

export async function assertAnyTextFromFewIsPresent(array) {
  const page = process.playwrightPage;
  console.log(`assert that any of texts [${array}] is present`);
  for (const text of array) {
    const locatorTextContains = getLocatorContainsText(text);
    if (await getNumberOfElements(locatorTextContains) > 0) {
      return;
    }
  }
  expect(false, `Cannot find any text from [${array}]`).toBe(true);
}

export async function assertAnyElementFromFewIsPresent(locatorsArray) {
  const page = process.playwrightPage;
  console.log(`assert that any of elements [${locatorsArray}] is present`);
  for (const locator of locatorsArray) {
    if (await getNumberOfElements(locator) > 0) {
      return;
    }
  }
  expect(false, `Cannot find any from [${locatorsArray}]`).toBe(true);
}

export async function getLinkHref(linkText) {
  console.log(`get href from link with text ${linkText}`);
  let locator = `//a[text()="${linkText}"]`;
  if (await getNumberOfElements(locator) === 0) {
    locator = `//a/*[text()="${linkText}"]/parent::a`;
  }
  if (await getNumberOfElements(locator) === 0) {
    locator = `//a[contains(text(),"${linkText}")]`;
  }
  const results = await getAttributeFromElements(locator, "href");
  console.log(results);
  expect(results.length, `cannot find link [${linkText}] or its href`).toBeGreaterThan(0);
  return results;
}

export async function assertLinkHref(linkText, linkHref) {
  console.log(`verify that the href from the link with text [${linkText}] = [${linkHref}]`);
  const href = await getLinkHref(linkText);
  expect.soft(href.includes(linkHref), `unexpected link href: ${href} should be ${linkHref}`).toBe(true);
}

export async function isElementEnabled(locator) {
  const page = process.playwrightPage;
  const isEnabled = await page.locator(locator).first().isEnabled();
  return isEnabled;
}

export async function assertElementIsEnabledOrDisabled(locator, trueOrFalse) {
  const isEnabled = await isElementEnabled(locator);
  expect(isEnabled, `assert element ${locator} is enabled = ${trueOrFalse}`).toBe(trueOrFalse);
}

export async function isAnyElementFromFewPresent(locatorsArray) {
  const page = process.playwrightPage;
  for (const locator of locatorsArray) {
    if (await getNumberOfElements(locator) > 0) {
      return true;
    }
  }
  return false;
}