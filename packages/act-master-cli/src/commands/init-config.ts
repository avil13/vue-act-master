import { ConfigManager } from '../lib/config-manager';

const configManager = new ConfigManager();

export const initConfig = async () => {
  const configPath = await configManager.getConfigInitPath();
  await configManager.createConfigFile(configPath);
  console.log(` Config created in "${configPath}"`);
};
