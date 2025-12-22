import { msg } from '@/lib/log-messages/log-result';
import { access, mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

import { ask } from '@/lib/ask';
import { ConfigManager } from '@/lib/config-manager';
import { getExampleActTemplate } from '@/lib/config-manager/get-example-act-template';

const configManager = new ConfigManager();

export const initConfig = async () => {
  const configPath = await configManager.getConfigInitPath();

  await configManager.createConfigFile(configPath);

  const rootDir = path.dirname(configPath);
  const hasActGenScript = await itHasActGenScript(path.dirname(configPath));

  if (!hasActGenScript) {
    // Ask user if they want to add 'act:gen' script to package.json
    const shouldAddScript = await ask(msg.getAddScriptText());
    if (shouldAddScript) {
      await addActGenScript(rootDir);
    }
  }

  // Ask to create example file
  const exampleFilePath =
    (await configManager.getConfig()).config.src + '/act/common/OnError.act.ts';

  if (!(await fileExists(exampleFilePath))) {
    const shouldCreateExampleErrorAct = await ask(
      msg.getAddExampleAct(rootDir, exampleFilePath)
    );

    if (shouldCreateExampleErrorAct) {
      await createExampleActFile(exampleFilePath);
    }
  }

  msg.logInitMessage(configPath, !hasActGenScript);
};

// Add 'act:gen' script to package.json
async function addActGenScript(rootDir: string): Promise<void> {
  const packageJsonPath = path.join(rootDir, 'package.json');
  try {
    const packageJsonContent = await readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);

    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    if (!packageJson.scripts['act:gen']) {
      packageJson.scripts['act:gen'] = 'act-master-cli g';
      const updatedContent = JSON.stringify(packageJson, null, 2) + '\n';
      await writeFile(packageJsonPath, updatedContent, 'utf8');
      console.log(
        'The "act:gen" script has been successfully added to package.json'
      );
    } else {
      console.log('The "act:gen" script already exists in package.json.');
    }
  } catch (error) {
    console.error('Error when adding a script to package.json:', error);
  }
}

// Check has script 'act:gen' in package.json
async function itHasActGenScript(rootDir: string): Promise<boolean> {
  const packageJsonPath = path.join(rootDir, 'package.json');
  try {
    const packageJsonContent = await readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);

    return !!(packageJson.scripts && packageJson.scripts['act:gen']);
  } catch (error) {
    console.log(error);
  }

  return false;
}

async function createExampleActFile(pathToFile: string): Promise<void> {
  const content = getExampleActTemplate();

  try {
    // Create directory structure if it doesn't exist
    const dirPath = path.dirname(pathToFile);
    await mkdir(dirPath, { recursive: true });

    // Write file with content
    await writeFile(pathToFile, content.trim() + '\n', 'utf8');
  } catch (error) {
    console.error(`${pathToFile}:`, error);
  }
}

function fileExists(path: string): Promise<boolean> {
  return access(path)
    .then(() => true)
    .catch(() => false);
}
