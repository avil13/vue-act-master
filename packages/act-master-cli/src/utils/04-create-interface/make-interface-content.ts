import {
  ClassDeclaration,
  ImportDeclaration,
  MethodDeclarationOverloadStructure,
  MethodDeclarationStructure,
  Project,
} from 'ts-morph';
import { IFilteredItem } from '../02-filter-list/index';
import { getImportDeclarations } from './make-index-content';

const getReturnType = (
  structure?: MethodDeclarationStructure | MethodDeclarationOverloadStructure
): string => {
  if (!structure) {
    return 'unknown';
  }

  const returnType = structure.returnType as string;

  if (returnType.includes('Promise')) {
    return returnType;
  }

  return structure.isAsync ? returnType : `Promise<${structure.returnType}>`;
};

const getFilteredImports = (
  returnType: string,
  imports: ImportDeclaration[]
) => {
  // const filteredImports: OptionalKind<ImportDeclarationStructure>[] = [];

  const returnTypes = returnType
    .replace(/Promise<([^>]+)>/gi, '$1')
    .split('|')
    .map((v) => v.trim());

  imports.forEach((imp) => {
    const defaultImport = imp.getStructure().defaultImport;

    if (defaultImport && returnTypes.includes(defaultImport)) {
      const p = imp.getSourceFile().getFilePath();
      console.log('=>', p);
    }
  });

  // console.log(
  //   '=>',
  //   // imports[0].getImportClause()?.getNamedImports()[0].getStructure().name
  //   imports[0].getStructure().namedImports,
  //   imports[0].getStructure().defaultImport
  // );
};

/**
 *
 * @returns String ('name', arg: type) => Promise<type>
 */
const getExecInterface = (item: IFilteredItem) => {
  const classDeclaration: ClassDeclaration = item.classDeclaration;

  const actName = classDeclaration.getProperty('name');
  const nameType = actName?.getInitializer()?.getText(false) || '';
  const nameArg = {
    name: 'actName',
    type: nameType,
  };

  const execSrc = classDeclaration.getInstanceMethod('exec');
  const methodStructure = execSrc?.getStructure();

  const params = methodStructure?.parameters?.map(({ name, type }) => ({
    name,
    type,
  }));
  const parameters = [nameArg, ...(params || [])];

  const fnSrc =
    classDeclaration.getMethod('transform') ||
    classDeclaration.getMethod('exec');
  const returnType = getReturnType(fnSrc?.getStructure());

  if (nameType === `'with-other-type-return'`) {
    const sourceFile = item.sourceFile;

    const imports = sourceFile.getImportDeclarations();
    getFilteredImports(returnType, imports);
  }

  return {
    parameters,
    returnType,
  };
};

const getFunctionSrcData = (items: IFilteredItem[]) => {
  return items.map((item) => getExecInterface(item));
};

/**
 * Function for creating ActMasterExec interface
 *
 * @param filePath absolute path for interface
 * @param items
 * @param fileSrc for testing don't do writing
 *
 * @example
 * import { ActMaster } from 'act-master';
 *
 * declare module 'act-master' {
 *   export interface ActMaster {
 *     exec(name: 'xxxx', login: string): Promise<boolean>;
 *   }
 * }
 */
export const makeInterfaceContent = (
  filePath: string,
  items: IFilteredItem[],
  isWrite = false
) => {
  const project = new Project();

  const sourceFile = project.createSourceFile(filePath);

  const actInterface = sourceFile.addInterface({
    name: 'ActMaster',
    isExported: true,
  });

  const actMethodTypes = getFunctionSrcData(items);

  actMethodTypes.forEach((v) => {
    actInterface.addMethod({
      name: 'exec',
      parameters: v.parameters,
      returnType: v.returnType,
    });
  });

  // wrap with declaration
  const interfaceText = sourceFile.getFullText();

  const declarationText = `declare module 'act-master' { ${interfaceText} }`;

  sourceFile.replaceWithText(declarationText);

  sourceFile.addImportDeclaration({
    namedImports: [{ name: 'ActMaster' }],
    moduleSpecifier: 'act-master',
  });

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
