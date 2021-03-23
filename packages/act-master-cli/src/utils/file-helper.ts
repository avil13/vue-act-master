import fs from 'fs';
import { promisify } from 'util';

const fsStatPromises = promisify(fs.stat);
const fsUnlinkPromises = promisify(fs.unlink);

export const isFileExist = async (pathToFile: string): Promise<boolean> => {
  const isExists = await fsStatPromises(pathToFile)
    .then((statItem) => statItem.isFile())
    .catch(() => false);

  return isExists;
};

export const removeFile = async (pathToFile: string) => {
  const isExist = await isFileExist(pathToFile);

  if (isExist) {
    await fsUnlinkPromises(pathToFile);
  }
};
