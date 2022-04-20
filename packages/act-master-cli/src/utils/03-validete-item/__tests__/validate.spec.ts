import { describe, expect, it } from 'vitest';
import { ActValidationError, ValidateError, validateItem } from '..';
import { getSourcesByPath } from '../../01-list-all-files';
import { actionFilter, IFilteredItem } from '../../02-filter-list';

// метод для получения отфильтрованной сущности
const getItem = (actionPath: string): IFilteredItem => {
  const sourceFileList = getSourcesByPath(actionPath, __dirname);
  const res = actionFilter(sourceFileList[0]);

  if (!res) {
    throw new Error('wrong Action');
  }
  return res;
};

describe('validateItem', () => {
  it('OK: no arg', () => {
    const item = getItem('./mocks/action-no-arg.ts');

    expect(validateItem(item)).toBe(true);
  });

  it('ERR: has arg, no type', () => {
    const item = getItem('./mocks/empty-arguments-type.ts');

    expect(validateItem(item)).toEqual(
      new ValidateError(item, ActValidationError.emptyArgumentsType)
    );
  });

  it('ERR: name is string', () => {
    const item = getItem('./mocks/wrong-name-type.ts');

    expect(validateItem(item)).toEqual(
      new ValidateError(item, ActValidationError.wrongNameType)
    );
  });

  it('ERR: exec retun type', () => {
    const item = getItem('./mocks/no-exec-return-type.ts');

    expect(validateItem(item)).toEqual(
      new ValidateError(item, ActValidationError.noReturnTypeExec)
    );
  });

  it('ERR: transform retun type', () => {
    const item = getItem('./mocks/no-transform-return-type.ts');

    expect(validateItem(item)).toEqual(
      new ValidateError(item, ActValidationError.noReturnTypeTransform)
    );
  });

  it('OK: transform retun type', () => {
    const item = getItem('./mocks/good-transform-return-type.ts');

    expect(validateItem(item)).toBe(true);
  });
});
