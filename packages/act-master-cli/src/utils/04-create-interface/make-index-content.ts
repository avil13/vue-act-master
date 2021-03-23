import path from 'path';
import {
  ImportDeclarationStructure,
  OptionalKind,
  Project,
  VariableDeclarationKind,
} from 'ts-morph';

import { IFilteredItem } from '../02-filter-list/index';

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

/**
 * Добавить нормализацию путей относительно файла
 *
 */
const normalizePathAlias = (filePath: string) => {
  const config = {
    src: path.normalize(`${process.cwd()}/src`),
    alias: '@',
  };

  return filePath.replace(config.src, config.alias);
};

export const getImportDeclarations = (
  items: IFilteredItem[]
): OptionalKind<ImportDeclarationStructure>[] => {
  return items.map((item) => {
    const className = getClassName(item);
    const moduleSpecifier = normalizePathAlias(item.sourceFile.getFilePath());

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
export const makeIndexContent = (
  filePath: string,
  items: IFilteredItem[],
  isWrite = false
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

  sourceFile.addImportDeclarations(getImportDeclarations(items));

  sourceFile.formatText({
    ensureNewLineAtEndOfFile: true,
    indentSize: 2,
  });

  if (isWrite) {
    sourceFile.save();

    return getImportDeclarations(items).map((item) => {
      return item.moduleSpecifier;
    });
  }

  return sourceFile.getFullText();
};
