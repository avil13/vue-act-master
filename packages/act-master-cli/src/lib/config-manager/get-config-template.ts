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
    // file to create an array of actions
    actionsIndexFile: 'act/act-generate/actions.ts',
    prefixText: '/* This is generated file */'
  }
};
`;

export const getConfigTemplate = (): string => {
  return TEMPLATE;
};
