const TEMPLATE = `
# yaml-language-server: $schema=https://raw.githubusercontent.com/avil13/vue-act-master/master/packages/act-master-cli/schema/schema.json

config:
  # the path to the folder with the source files relative to this file
  src: './src'
  alias: '@/'
actionsPatterns: # a patterns for finding action files
  - 'act/**/*.act.ts'
generate:
  actionsIndexFile: 'act/generated/actions.ts'
  prefixText: '/* This is generated file */'
`.trim();

export const getConfigTemplate = (): string => {
  return TEMPLATE;
};
