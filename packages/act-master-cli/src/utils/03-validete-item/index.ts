import { IFilteredItem } from './../02-filter-list';

export enum ActValidationError {
  noExecMethod = 'NO EXEC METHOD',
  emptyArgumentsType = 'EMPTY ARGUMENTS TYPE',
  wrongNameType = 'WRONG NAME TYPE',
  noReturnTypeExec = 'NO RETURN TYPE EXEC',
  noReturnTypeTransform = 'NO RETURN TYPE TRANSFORM',
}

export class ValidateError extends Error {
  readonly filePath: string;
  readonly className?: string;
  readonly type: ActValidationError;

  constructor(item: IFilteredItem, type: ActValidationError) {
    super();
    this.filePath = item.sourceFile.getFilePath();
    this.className = item.classDeclaration.getName();
    this.type = type;

    this.message = [this.className, this.type, this.filePath, ''].join('\n');
  }
}

export const validateItem = (item: IFilteredItem): ValidateError | true => {
  const { classDeclaration } = item;

  const execStr = classDeclaration.getInstanceMethod('exec')?.getStructure();

  if (!execStr) {
    throw new ValidateError(item, ActValidationError.noExecMethod);
  }

  // no arg types
  const params =
    execStr.parameters?.map(({ name, type }) => ({ name, type })) || [];

  if (params.every(({ type }) => type !== undefined) !== true) {
    throw new ValidateError(item, ActValidationError.emptyArgumentsType);
  }

  // name === string
  const nameProp = classDeclaration.getProperty('name');
  const isStringLiteral = nameProp
    ?.getInitializer()
    ?.getType()
    .isStringLiteral();

  if (!isStringLiteral) {
    throw new ValidateError(item, ActValidationError.wrongNameType);
  }

  // return type exec !== undefined
  const execMethodDecl = classDeclaration.getMethod('exec');
  const execReturnType = execMethodDecl?.getStructure().returnType;

  if (execReturnType === undefined) {
    throw new ValidateError(item, ActValidationError.noReturnTypeExec);
  }

  // return type transform is undefined or any
  const transformMethodDecl = classDeclaration.getMethod('transform');
  if (transformMethodDecl) {
    const transformReturnType = transformMethodDecl?.getStructure().returnType;

    if (transformReturnType === undefined || transformReturnType === 'any') {
      throw new ValidateError(item, ActValidationError.noReturnTypeTransform);
    }
  }

  return true;
};
