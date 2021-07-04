import { ActCliConfig } from '../types';

export const normalizePathAlias = (filePath: string, config: ActCliConfig) => {
  return filePath.replace(config.config.src, config.config.alias);
};
