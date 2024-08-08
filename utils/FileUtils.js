import * as fs from 'fs';
import path from 'path';

export const logsFolder = 'logs';
export const pageSourceFolder = logsFolder + path.sep + 'page_source';
export const consoleErrorsFolder = logsFolder + path.sep + 'console_errors';

export const logsFolderPath = logsFolder + path.sep;

export function savePageSource(fileName, pageSource) {
  try {
    if (!fs.existsSync(logsFolder)) {
      fs.mkdirSync(logsFolder);
    }
    if (!fs.existsSync(pageSourceFolder)) {
      fs.mkdirSync(pageSourceFolder);
    }
    fs.appendFileSync(pageSourceFolder + path.sep + fileName, `${pageSource}\n`, 'utf8');
  } catch (err) {
    console.error(err);
  }
}

export function cleanupFolder(folder) {
  fs.rm(folder, { recursive: true, force: true }, err => {
    if (err) {
      console.error(`ERROR WHILE DELETING FOLDER - ${folder}`);
      console.error(err.message);
    } else {
      console.log(`Cleaning up [${folder}] folder`);
    }
  });
}

export function writeConsoleErrorsToFile(consoleErrorsArray, jsErrorsArray, fileName) {
  if (!fs.existsSync(consoleErrorsFolder + path.sep + fileName)) {
    appendConsoleErrorsFile(fileName, 'level,page,errorText,details');
  }
  if (jsErrorsArray.length !== 0) {
    appendConsoleErrorsFile(fileName, jsErrorsArray.map(convertObjectToStringForCsvFile).join('\n'));
  }
  if (consoleErrorsArray.length !== 0) {
    appendConsoleErrorsFile(fileName, consoleErrorsArray.map(convertObjectToStringForCsvFile).join('\n'));
  }
}

export function appendConsoleErrorsFile(fileName, line) {
  try {
    if (!fs.existsSync(logsFolder)) {
      fs.mkdirSync(logsFolder);
    }
    if (!fs.existsSync(consoleErrorsFolder)) {
      fs.mkdirSync(consoleErrorsFolder);
    }
    fs.appendFileSync(consoleErrorsFolder + path.sep + fileName, `${line}\n`, 'utf8');
  } catch (err) {
    console.log('--- error when writing console errors to file ---');
    console.error(err);
  }
}

export function convertObjectToStringForCsvFile(obj) {
  let str = '';
  for (const [p, val] of Object.entries(obj)) {
    const text = `${val}`.replace(/\n/g, '').replace(/,/g, ';'); // remove all \n and replace all ',' with ';' not to mess up the csv
    str += `${text},`;
  }
  return str.slice(0, str.length - 1);
}

export function appendLogFile(fileName, line) {
  try {
    if (!fs.existsSync(logsFolder)) {
      fs.mkdirSync(logsFolder);
    }
  } catch (err) {
    console.error(err);
  }
  fs.appendFileSync(logsFolder + path.sep + fileName, `${line}\n`, 'utf8');
}

export function logToConsoleAndOutputFile(message, fileName) {
  console.log(message);
  appendLogFile(fileName, message);
}