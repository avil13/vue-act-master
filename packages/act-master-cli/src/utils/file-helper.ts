import { stat, unlink, readFile } from 'fs/promises';
import path from 'path';

export const isFileExist = async (pathToFile: string): Promise<boolean> => {
  const isExists = await stat(pathToFile)
    .then((statItem) => statItem.isFile())
    .catch(() => false);

  return isExists;
};

export const removeFile = async (pathToFile: string) => {
  const isExist = await isFileExist(pathToFile);

  if (isExist) {
    await unlink(pathToFile);
  }
};

export const joinPath = (path1: string, path2?: string): string => {
  if (!path2) {
    return '';
  }
  return path.join(path1, path2);
};

export interface StaticCtx {
  isExist: boolean;
  content: string;
}

export const getStaticContentFromFile = async (
  pathToFile: string
): Promise<StaticCtx> => {
  const isExist = await isFileExist(pathToFile);
  const result: StaticCtx = {
    isExist,
    content: '',
  };

  if (isExist) {
    const data = await readFile(pathToFile, 'utf8');
    const strList: string[] = [];
    const reStart = new RegExp(`/\\* staticStart \\*/`);
    const reEnd = new RegExp(`/\\* staticEnd \\*/`);
    let write = false;

    data.split('\n').forEach((line) => {
      if (reStart.test(line)) {
        write = true;
      }

      if (write) {
        strList.push(line);
      }

      if (reEnd.test(line)) {
        write = false;
      }
    });

    result.content = strList.join('\n');
  }

  return result;
};
