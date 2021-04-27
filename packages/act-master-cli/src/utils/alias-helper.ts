import path from 'path';

export const normalizePathAlias = (filePath: string) => {
  const config = {
    src: path.normalize(`${process.cwd()}/src`),
    alias: '@',
  };

  return filePath.replace(config.src, config.alias);
};
