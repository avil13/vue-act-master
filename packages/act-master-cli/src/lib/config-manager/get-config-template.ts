const TEMPLATE = `
/** @typedef { import('act-master-cli/dist/types').ActCliConfig } ActCliConfig */

/**
 *@type {ActCliConfig}
 */
module.exports = {
  config: {
    // the path to the folder with the source files relative to this file
    src: './src',
    alias: '@',
  },

  // a pattern for finding action files
  actionsPatterns: [
    'acts/**/*.act.ts',
  ],

  generate: {
    // file for creating the action interface
    actionsInterface: 'act-generate/actions-interface.d.ts',
    // file to create an array of actions
    actionsIndexFile: 'act-generate/actions.ts',
  }
};
`;

export const getConfigTemplate = (): string => {
  return TEMPLATE;
};
