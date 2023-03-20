import { ConfigManager } from '../lib/config-manager';
import { logResult } from '../lib/log-messages/log-result';
import { getSourcesByPath } from '../utils/01-list-all-files';
import { getFilteredSourceFiles } from '../utils/02-filter-list';
import { validateItem } from '../utils/03-validete-item';
import { makeIndexContent } from '../utils/04-create-interface/make-index-content';
import { getStaticContentFromFile, removeFile } from '../utils/file-helper';

export const generateActionList = async () => {
  const configManager = new ConfigManager();
  await configManager.hasConfig();
  const ActCliConfig = await configManager.getConfig();

  // Search files
  const sourceFiles = getSourcesByPath(
    ActCliConfig.actionsPatterns,
    ActCliConfig.config.src
  );

  // Filter and validate
  const actionList = getFilteredSourceFiles(sourceFiles).filter(validateItem);

  // Build actions index file
  const prefixForIndex = [];

  const contentCtxIndex = await getStaticContentFromFile(
    ActCliConfig.generate.actionsIndexFile
  );

  if (contentCtxIndex.content) {
    prefixForIndex.push(contentCtxIndex.content);
  }

  if (ActCliConfig.generate.prefixText) {
    prefixForIndex.push(ActCliConfig.generate.prefixText);
  }

  await removeFile(ActCliConfig.generate.actionsIndexFile);

  const isCreateFile = !process.env.TEST;

  const resContent = await makeIndexContent(
    ActCliConfig.generate.actionsIndexFile,
    actionList,
    isCreateFile,
    prefixForIndex.join('\n')
  );

  const addedActionsPaths = actionList.map((s) => {
    return s.sourceFile.getFilePath();
  });

  const actShortList: string[] = await configManager.trimPaths(
    addedActionsPaths
  );

  if (isCreateFile) {
    logResult(actShortList);
  }

  return resContent;
};
