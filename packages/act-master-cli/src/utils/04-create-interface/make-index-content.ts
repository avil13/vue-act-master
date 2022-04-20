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
  interfaceTextPrefix = ''
) => {
  const project = new Project();

  const sourceFile = project.createSourceFile(filePath);

  const importDeclaration = sourceFile.addImportDeclaration({
    moduleSpecifier: 'act-master',
  });

  importDeclaration.addNamedImport('ActMasterAction');

  sourceFile.insertStatements(1, '');

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: 'actions',
        type: 'ActMasterAction[]',
        initializer: getInitializerList(items),
      },
    ],
  });

  if (interfaceTextPrefix) {
    sourceFile.insertText(0, interfaceTextPrefix);
  }

  const config = await configManager.getConfig();

  sourceFile.addImportDeclarations(getImportDeclarations(items, config));

  sourceFile.formatText({
    ensureNewLineAtEndOfFile: true,
    indentSize: 2,
  });

  if (isWrite) {
    sourceFile.save();

    return getImportDeclarations(items, config).map((item) => {
      return item.moduleSpecifier;
    });
  }

  return sourceFile.getFullText();
};
