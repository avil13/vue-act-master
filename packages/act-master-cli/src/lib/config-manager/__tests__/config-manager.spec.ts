import { it, expect, describe, beforeEach } from 'vitest';
import { ConfigManager } from '..';
import { ActCliConfig } from './../../../types';
describe('ConfigManager', () => {
  let configManager = new ConfigManager();

  beforeEach(() => {
    configManager = new ConfigManager();
  });

  it.todo('hasConfig');
  it.todo('getConfig');
  it.todo('getConfigPath');
  it.todo('createConfigFile');

  it('validateConfig GOOD', () => {
    const actCliConfig: ActCliConfig = {
      config: {
        // the path to the folder with the source files relative to this file
        src: './src',
        alias: '@',
      },

      // a pattern for finding action files
      actionsPatterns: ['utils/__fixtures__/**/*.ts'],

      generate: {
        actionsIndexFile: 'actions.ts',
      },
    };

    const result = configManager.validateConfig(actCliConfig);

    expect(result).toBe(true);
  });

  it('validateConfig BAD', () => {
    const actCliConfig = {
      config: {
        // the path to the folder with the source files relative to this file
        src: './src',
        // alias: '@'
      },

      // a pattern for finding action files
      actionsPatterns: [
        // 'utils/__fixtures__/**/*.ts',
      ],

      generate: {
        // actionsInterface: 'actions-interface.d.ts',
        actionsIndexFile: 'actions.ts',
      },
    } as unknown as ActCliConfig;

    const result = configManager.validateConfig(actCliConfig);

    expect(result).toBe(false);
    expect(configManager.lastValidateErrors).toEqual([
      {
        instancePath: '/config',
        keyword: 'required',
        message: "must have required property 'alias'",
        params: {
          missingProperty: 'alias',
        },
        schemaPath: '#/properties/config/required',
      },
      // {
      //   instancePath: '/actionsPatterns',
      //   keyword: 'minItems',
      //   message: 'should NOT have fewer than 1 items',
      //   params: {
      //     limit: 1,
      //   },
      //   schemaPath: '#/properties/actionsPatterns/minItems'
      // },
      // {
      //   instancePath: '/generate',
      //   keyword: 'required',
      //   message: 'should have required property \'actionsInterface\'',
      //   params: {
      //     missingProperty: 'actionsInterface'
      //   },
      //   schemaPath: '#/properties/generate/required'
      // }
    ]);
  });

  it('trimPath', async () => {
    const list = await configManager.trimPaths(
      ['/home/project/src/index.ts', '/home/project/src/folder/app.ts'],
      '/home/project/.act-master.yaml'
    );

    expect(list).toEqual(['/src/index.ts', '/src/folder/app.ts']);
  });
});
