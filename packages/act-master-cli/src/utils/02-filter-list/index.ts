import { ClassDeclaration, SourceFile } from 'ts-morph';

export interface IFilteredItem {
  sourceFile: SourceFile;
  classDeclaration: ClassDeclaration;
}

const filterActionClasses = (clsDeclItem: ClassDeclaration): boolean => {
  const name = clsDeclItem.getProperty('name');
  const execSrc = clsDeclItem.getInstanceMethod('exec');
  return (name && execSrc && true) || false;
};

/**
 * Если item не экшен, то возвращет false
 *
 * @param sourceFile {SourceFile}
 */
export const actionFilter = (sourceFile: SourceFile): false | IFilteredItem => {
  const classList = sourceFile.getClasses();

  if (classList.length === 0) {
    return false;
  }

  const classDeclarations = classList.filter((item) =>
    filterActionClasses(item)
  );

  if (classDeclarations.length !== 1) {
    return false;
  }

  return {
    sourceFile,
    classDeclaration: classDeclarations[0],
  };
};

export const getFilteredSourceFiles = (
  listFiles: SourceFile[]
): IFilteredItem[] => {
  return listFiles
    .map((item) => actionFilter(item))
    .filter((item) => item) as IFilteredItem[];
};
