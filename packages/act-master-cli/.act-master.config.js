// DEMO CONFIG

/** @typedef { import('./dist/types').ActCliConfig } ActCliConfig */

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
    'utils/__fixtures__/**/*.ts',
  ],

  generate: {
    // file to create an array of actions
    actionsIndexFile: '../test-act-generate/actions.ts',
  }
};
