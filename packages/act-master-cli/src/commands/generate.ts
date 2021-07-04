import { ConfigManager } from '../lib/config-manager';
import { getSourcesByPath } from '../utils/01-list-all-files';
import { actionFilter, IFilteredItem } from '../utils/02-filter-list';
import { validateItem } from '../utils/03-validete-item';
import { makeIndexContent } from '../utils/04-create-interface/make-index-content';
import { makeInterfaceContent } from '../utils/04-create-interface/make-interface-content';
import { removeFile } from './../utils/file-helper';

const configManager = new ConfigManager();

export const generateCommand = async () => {
  let indexInfo = ``;

  await configManager.hasConfig();
  const ActCliConfig = await configManager.getConfig();

  const listFiles = getSourcesByPath(
    ActCliConfig.actionsPatterns,
    ActCliConfig.config.src
  );

  const actionUnfilteredList = listFiles
    .map((item) => actionFilter(item))
    .filter((item) => item) as IFilteredItem[];

  const actionFilteredList = actionUnfilteredList.filter((item) => {
    const res = validateItem(item);
    if (res !== true) {
      console.warn(res);
      return false;
    }
    return true;
  });

  // create actions interface
  await removeFile(ActCliConfig.generate.actionsInterface);
  let listImportedFiles = await makeInterfaceContent(
    ActCliConfig.generate.actionsInterface,
    actionFilteredList,
    true
  );

  indexInfo += `\nInterface: "${ActCliConfig.generate.actionsInterface}"`;

  if (!Array.isArray(listImportedFiles)) {
    listImportedFiles = [listImportedFiles];
  }

  // actions index
  if (ActCliConfig.generate.actionsIndexFile) {
    await removeFile(ActCliConfig.generate.actionsIndexFile);
    makeIndexContent(
      ActCliConfig.generate.actionsIndexFile,
      actionFilteredList,
      true
    );
    indexInfo += `\nActions file: "${ActCliConfig.generate.actionsIndexFile}"`;
  }

  indexInfo += `\n\nactions list:\n - ${[listImportedFiles.join('\n - ')]}\n`;
  console.log(indexInfo);
};
