import { extname } from 'path';
import { ActCliConfig } from '../types';

export const normalizePathAlias = (
  filePath: string,
  config: ActCliConfig
): string => {
  const normalizedPath = filePath.replace(
    config.config.src,
    config.config.alias
  );

  const ext = extname(normalizedPath);

  if (ext) {
    return normalizedPath.replace(new RegExp(`\\${ext}$`, 'g'), '');
  }

  return normalizedPath;
};
