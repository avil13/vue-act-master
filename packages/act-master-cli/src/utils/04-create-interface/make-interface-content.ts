import { ClassDeclaration, Project } from 'ts-morph';
import { IFilteredItem } from '../02-filter-list/index';
import { getImportDeclarations } from './make-index-content';

/**
 *
 * @returns String ('name', arg: type) => Promise<type>
 */
const getExecInterface = (item: ClassDeclaration) => {
  const actName = item.getProperty('name');
  const nameType = actName?.getInitializer()?.getText(false) || '';
  const nameArg = {
    name: 'actName',
    type: nameType,
  };

  const execSrc = item.getInstanceMethod('exec');
  const methodStructure = execSrc?.getStructure();

  const params = methodStructure?.parameters?.map(({ name, type }) => ({
    name,
    type,
  }));
  const parameters = [nameArg, ...(params || [])];

  const fnSrc = item.getMethod('transform') || item.getMethod('exec');
  const returnType = fnSrc?.getStructure().isAsync
    ? fnSrc?.getStructure().returnType
    : `Promise<${fnSrc?.getStructure().returnType}>`;

  return {
    parameters,
    returnType,
  };
};

const getFunctionSrcData = (items: IFilteredItem[]) => {
  return items.map((item) => getExecInterface(item.classDeclaration));
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

  sourceFile.addImportDeclaration({
    namedImports: [{ name: 'ActMaster' }],
    moduleSpecifier: 'act-master',
  });

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
