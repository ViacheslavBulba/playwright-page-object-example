import { expect } from '@playwright/test';
import { getAttributeFromElements, getNumberOfElements, getOuterHTMLFromElements } from "./WebElementUtils.js";

const alreadyReportedImagesWithoutAlt = [];

export async function collectImagesWithoutAltAttribute() {
  const problematicImages = [];
  const problematicImagesIndexes = [];
  const targetLocator = '//img[not(@aria-hidden="true")]';
  const imagesAmount = await getNumberOfElements(targetLocator);
  console.log(`found ${imagesAmount} images on the page`);
  const allImagesAltTexts = await getAttributeFromElements(targetLocator, 'alt');
  console.log(`found ${allImagesAltTexts.length} alt attributes for images`);
  const allImagesSrc = await getAttributeFromElements(targetLocator, 'src');
  console.log(`found ${allImagesSrc.length} scr attributes for images`);
  const elementsOuterHtmls = await getOuterHTMLFromElements(targetLocator);
  expect(allImagesAltTexts.length).toBe(imagesAmount);
  expect(allImagesAltTexts.length).toBe(allImagesSrc.length);
  for (let i = 0; i < allImagesAltTexts.length; i++) {
    if (allImagesAltTexts[i].length <= 3) {
      if (!alreadyReportedImagesWithoutAlt.includes(allImagesSrc[i])) {
        problematicImagesIndexes.push(i);
        problematicImages.push(`${elementsOuterHtmls[i]}`);
      } else {
        console.log(`already reported - ${allImagesSrc[i].slice(0, 90)}`);
      }
    }
  }
  if (problematicImagesIndexes.length > 0) {
    console.log('');
    console.log('images with alt text concerns:', problematicImagesIndexes.length);
    problematicImagesIndexes.forEach((index) => {
      console.log(`--------------------`);
      console.log(`element: ${elementsOuterHtmls[index]}`);
      console.log(`src: ${allImagesSrc[index]}`);
      console.log(`alt: [${allImagesAltTexts[index]}]`);
    });
    console.log(`--------------------`);
    console.log('');
  } else {
    console.log('no new issues discovered');
  }
  return problematicImages;
}

const alreadyReportedInputsWithoutAriaLabel = [];

export async function collectInputsWithoutAriaLabel() {
  const page = process.playwrightPage;
  const problematicElements = [];
  const problematicElementsIndexes = [];
  const targetLocator = '//input[not(@type="hidden")]';
  const elementsAmount = await getNumberOfElements(targetLocator);
  console.log(`found ${elementsAmount} inputs on the page`);
  const allInputsAriaLabels = await getAttributeFromElements(targetLocator, 'aria-label');
  const allInputsPlaceholders = await getAttributeFromElements(targetLocator, 'placeholder');
  console.log(`found ${allInputsPlaceholders.length} placeholder attributes`);
  const allInputsDataTestIds = await getAttributeFromElements(targetLocator, 'data-testid');
  const elementsOuterHtmls = await getOuterHTMLFromElements(targetLocator);
  const allInputsIds = await getAttributeFromElements(targetLocator, 'id');
  expect(allInputsAriaLabels.length).toBe(elementsAmount);
  expect(allInputsAriaLabels.length).toBe(allInputsPlaceholders.length);
  expect(allInputsAriaLabels.length).toBe(allInputsDataTestIds.length);
  for (let i = 0; i < allInputsAriaLabels.length; i++) {
    if (allInputsAriaLabels[i].length <= 1) { // shortest - 2 symbols
      if (!alreadyReportedInputsWithoutAriaLabel.includes(elementsOuterHtmls[i])) {
        // if there is no aria-label on the input itself, go and check it on <label> related to that input
        const outerHtml = elementsOuterHtmls[i];
        const inputId = allInputsIds[i];
        let labelForInputAriaLabel = '';
        if (await getNumberOfElements(`//label[@for="${inputId}"]`) > 0) {
          const label = await page.locator(`//label[@for="${inputId}"]`).first();
          labelForInputAriaLabel = await label.getAttribute('aria-label');
        }
        if (labelForInputAriaLabel === null || labelForInputAriaLabel.length <= 1) {
          problematicElementsIndexes.push(i);
          problematicElements.push(`${elementsOuterHtmls[i]}`);
        }
      } else {
        console.log(`already reported - ${elementsOuterHtmls[i]}`);
      }
    }
  }
  if (problematicElementsIndexes.length > 0) {
    console.log('');
    console.log('inputs with aria-labels concerns:', problematicElementsIndexes.length);
    problematicElementsIndexes.forEach((index) => {
      console.log(`--------------------`);
      console.log(`element: ${elementsOuterHtmls[index]}`);
      console.log(`placeholder: [${allInputsPlaceholders[index]}]`);
      console.log(`aria-label: [${allInputsAriaLabels[index]}]`);
    });
    console.log(`--------------------`);
    console.log('');
  } else {
    console.log('no new issues discovered');
  }
  return problematicElements;
}

const alreadyReportedButtons = [];

export async function collectButtonsWithoutAriaLabel() {
  const page = process.playwrightPage;
  const problematicElements = [];
  const problematicElementsIndexes = [];
  const targetLocator = '//button[not(@aria-hidden="true")][not(contains(@class,"visibility-hidden"))]';
  const elementsAmount = await getNumberOfElements(targetLocator);
  console.log(`found ${elementsAmount} buttons on the page`);
  const allElementsAriaLabels = await getAttributeFromElements(targetLocator, 'aria-label');
  const allElementsOuterHtmls = await getOuterHTMLFromElements(targetLocator);
  expect(allElementsAriaLabels.length).toBe(elementsAmount);
  for (let i = 0; i < allElementsAriaLabels.length; i++) {
    if (allElementsAriaLabels[i].length <= 1) { // shortest - 2 symbols
      if (!alreadyReportedButtons.includes(allElementsOuterHtmls[i])) {
        problematicElementsIndexes.push(i);
        problematicElements.push(`${allElementsOuterHtmls[i]}`);
      } else {
        console.log(`already reported - ${allElementsOuterHtmls[i]}`);
      }
    }
  }
  if (problematicElementsIndexes.length > 0) {
    console.log('');
    console.log('buttons with aria-labels concerns:', problematicElementsIndexes.length);
    problematicElementsIndexes.forEach((index) => {
      console.log(`--------------------`);
      console.log(`element: ${allElementsOuterHtmls[index]}`);
      console.log(`aria-label: [${allElementsAriaLabels[index]}]`);
    });
    console.log(`--------------------`);
  } else {
    console.log('no new issues discovered');
  }
  console.log('');
  return problematicElements;
}