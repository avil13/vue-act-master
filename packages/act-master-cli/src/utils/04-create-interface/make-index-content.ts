import { ConfigManager } from '../../lib/config-manager';
import { ActCliConfig } from '../../types';
import {
  ImportDeclarationStructure,
  OptionalKind,
  Project,
  VariableDeclarationKind,
} from 'ts-morph';
import { IFilteredItem } from '../02-filter-list/index';
import { normalizePathAlias } from '../alias-helper';

const configManager = new ConfigManager();

const getClassName = (item: IFilteredItem): string => {
  const classDeclaration = item.classDeclaration;

  const name = classDeclaration.getName();

  if (!name) {
    throw new Error(`Empty name ${item.classDeclaration}`);
  }

  return name;
};

const getInitializer = (item: IFilteredItem): string => {
  const className = getClassName(item);
  return `new ${className}()`;
};

const getInitializerList = (items: IFilteredItem[]) => {
  const str = items.map((item) => getInitializer(item)).join(',\n ');
  return `[\n ${str},\n]`;
};

export const getImportDeclarations = (
  items: IFilteredItem[],
  config: ActCliConfig
): OptionalKind<ImportDeclarationStructure>[] => {
  return items.map((item) => {
    const className = getClassName(item);
    const moduleSpecifier = normalizePathAlias(
      item.sourceFile.getFilePath(),
      config
    );

    return {
      namedImports: [
        {
          name: className,
        },
      ],
      moduleSpecifier,
    };
  });
};

/**
 * Создаем файл со списком подключаемых экшенов
 *
 * @param filePath
 * @param items
 * @param isWrite
 */
export const makeIndexContent = async (
  filePath: string,
  items: IFilteredItem[],
  isWrite = false,
  prefix = ''
) => {
  const project = new Project();

  const sourceFile = project.createSourceFile(filePath);

  const importDeclaration = sourceFile.addImportDeclaration({
    moduleSpecifier: 'act-master',
  });

  if (prefix) {
    sourceFile.addStatements(prefix + '\n\n');
  }

  // importDeclaration.addNamedImport('ActMasterAction');
  importDeclaration.addNamedImport('Acts');
  importDeclaration.addNamedImport('Names');
  importDeclaration.addNamedImport('Subs');

  sourceFile.insertStatements(1, '');

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: 'actions',
        // type: 'ActMasterAction[]',
        initializer: getInitializerList(items),
      },
    ],
  });

  const config = await configManager.getConfig();

  sourceFile.addImportDeclarations(getImportDeclarations(items, config));

  // Add Types
  const typeDeclarations = `
  declare module 'act-master' {
    export interface ActGenerated {
      acts: Acts<typeof actions>;
      subs: Subs<typeof actions>;
      names: Names<typeof actions>;
    }
    export interface ActMaster {
      exec: Acts<typeof actions>;
    }
  }`;

  sourceFile.addStatements(typeDeclarations);

  sourceFile.formatText({
    ensureNewLineAtEndOfFile: true,
    indentSize: 2,
  });

  if (isWrite) {
    await sourceFile.save();
  }

  return sourceFile.getFullText();
};
