import fs from 'fs';
import path from 'path';
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

export const joinPath = (path1: string, path2?: string): string => {
  if (!path2) {
    return '';
  }
  return path.join(path1, path2);
};
