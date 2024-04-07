import * as fs from 'fs';
import path from 'path';

export const logsFolder = 'logs';
export const pageSourceFolder = logsFolder + path.sep + 'page_source';

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