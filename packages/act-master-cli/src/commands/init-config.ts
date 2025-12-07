import { readFile } from 'fs/promises';
import path from 'path';
import { logInitMessage } from 'lib/log-messages/log-result';
import { ConfigManager } from '../lib/config-manager';

const configManager = new ConfigManager();

export const initConfig = async () => {
  const configPath = await configManager.getConfigInitPath();

  await configManager.createConfigFile(configPath);

  let hasActGenScript = false;

  // Check has script 'act:gen' in package.json
  const packageJsonPath = path.join(path.dirname(configPath), 'package.json');
  try {
    const packageJsonContent = await readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    hasActGenScript = !!(packageJson.scripts && packageJson.scripts['act:gen']);
  } catch (error) {
    console.log(error);
  }

  logInitMessage(configPath, !hasActGenScript);
};
