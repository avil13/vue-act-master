import { joinPath } from '../../utils/file-helper';
import Ajv from 'ajv';
import { ErrorObject } from 'ajv/dist/jtd';
import findUp from 'find-up';
import fs from 'fs';
import { dirname, join } from 'path';
import { promisify } from 'util';
import { ActCliConfig } from './../../types';
import { getConfigTemplate } from './get-config-template';

const fsWriteFilePromises = promisify(fs.writeFile);
const ajv = new Ajv();

export class ConfigManager {
  private ActCliConfigFileNames = ['.act-master.config.js'];

  async hasConfig(): Promise<boolean> {
    const configPath = await this.getConfigPath();

    if (!configPath) {
      throw new Error(` Can't find file "${this.ActCliConfigFileNames[0]}"`);
    }

    const conf = await this.getConfig(configPath);

    const isValid = this.validateConfig(conf);

    if (!isValid) {
      console.error(this.lastValidateErrors);
      throw new Error(`Invalid config "${configPath}"`);
    }

    return !!configPath;
  }

  async getConfig(configPath?: string): Promise<ActCliConfig> {
    const configPathForLoad = configPath || (await this.getConfigPath());
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ActCliConfig: ActCliConfig = require(configPathForLoad);

    const configSrc = join(process.cwd(), ActCliConfig.config.src);

    const configAlias = ActCliConfig.config.alias || '@';

    const actionsInterface = joinPath(
      configSrc,
      ActCliConfig.generate.actionsInterface
    );

    const actionsIndexFile = joinPath(
      configSrc,
      ActCliConfig.generate.actionsIndexFile
    );

    return {
      config: {
        src: configSrc,
        alias: configAlias,
      },
      actionsPatterns: ActCliConfig.actionsPatterns,
      generate: {
        actionsInterface,
        actionsIndexFile,
        actionsInterfaceTextPrefix:
          ActCliConfig.generate.actionsInterfaceTextPrefix,
        actionsIndexTextPrefix: ActCliConfig.generate.actionsIndexTextPrefix,
      },
    };
  }

  async getConfigInitPath(): Promise<string> {
    const filePath = await findUp('package.json');
    if (!filePath) {
      throw new Error('cant find root dir. Check "package.json" file path');
    }
    const dir = dirname(filePath);

    return join(dir, this.ActCliConfigFileNames[0]);
  }

  async getConfigPath(): Promise<string> {
    let filePath: string | undefined = '';

    for (let i = 0; i < this.ActCliConfigFileNames.length; i++) {
      const file = this.ActCliConfigFileNames[i];
      filePath = await findUp(file);

      if (filePath) {
        return filePath;
      }
    }

    return filePath || '';
  }

  async createConfigFile(filePath: string) {
    const config = getConfigTemplate();
    return fsWriteFilePromises(filePath, config);
  }

  private configSchema = {
    type: 'object',
    additionalProperties: false,
    required: ['config', 'actionsPatterns', 'generate'],
    properties: {
      config: {
        type: 'object',
        additionalProperties: false,
        required: ['src', 'alias'],
        properties: {
          src: { type: 'string' },
          alias: { type: 'string' },
        },
      },
      actionsPatterns: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'string',
        },
      },
      generate: {
        type: 'object',
        additionalProperties: false,
        required: ['actionsInterface'],
        properties: {
          actionsInterface: {
            type: 'string',
          },
          actionsIndexFile: {
            type: 'string',
          },
          actionsIndexTextPrefix: {
            type: 'string',
          },
          actionsInterfaceTextPrefix: {
            type: 'string',
          },
        },
      },
    },
  };

  lastValidateErrors?: null | ErrorObject[] = null;

  validateConfig(config: ActCliConfig) {
    const validate = ajv.compile<ActCliConfig>(this.configSchema);
    const result = validate(config);
    this.lastValidateErrors = result ? null : validate.errors;
    return result;
  }
}
