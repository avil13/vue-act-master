export interface ActCliConfig {
  config: {
    // the path to the folder with the source files relative to this file
    src: string;
    alias: '@' | string;
  };

  // a pattern for finding action files
  actionsPatterns: string[];

  generate: {
    // file for creating the action interface
    actionsInterface: string;
    // file to create an array of actions
    actionsIndexFile?: string;
  };
}
