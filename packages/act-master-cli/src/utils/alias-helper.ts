import { extname, normalize } from 'path';
import { ActCliConfig } from '../types';

export const normalizePathAlias = (
  filePath: string,
  config: ActCliConfig
): string => {
  const normalizedPath = normalize(filePath)
    .replace(
      config.config.src,
      config.config.alias
    )
    .replace(/\\/g, '/');

  const ext = extname(normalizedPath);

  if (ext) {
    return normalizedPath.replace(new RegExp(`\\${ext}$`, 'g'), '');
  }


  return normalizedPath;
};
