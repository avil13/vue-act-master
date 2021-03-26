import { getSourcesByPath } from '../../01-list-all-files/index';
import { actionFilter, IFilteredItem } from '../../02-filter-list/index';
import { makeIndexContent } from '../make-index-content';
import { makeInterfaceContent } from '../make-interface-content';

// метод для получения отфильтрованной сущности
const getItems = (actionPath: string): IFilteredItem[] => {
  const sourceFileList = getSourcesByPath(actionPath, __dirname);

  return sourceFileList
    .map((item) => actionFilter(item))
    .filter<IFilteredItem>(
      //@ts-ignore
      Boolean
    );
};

describe('validateItem', () => {
  it.each<[string]>([
    //
    // ['export interface ActMaster'],
    [
      `exec(actName: 'async.action', arg0: number, arg1: string): Promise<{ name: string; age: number } | null>;`,
    ],
  ])('getInterfaceContent(%s)', (expected) => {
    const items = getItems('../../__fixtures__/**/*ts');

    const res = makeInterfaceContent('path/to/interface.d.ts', items);

    expect(res).toMatch(expected);
  });

  it('getIndexContent', () => {
    const items = getItems('../../__fixtures__/**/*ts');

    const res = makeIndexContent('path/to/action.ts', items);
    const etalonList = `
export const actions: ActMasterAction[] = [
  new AsyncAction(),
  new NoPromiseAction(),
];
`;
    const etalonImports = `
import { ActMasterAction } from "act-master";
import { AsyncAction } from "@/utils/__fixtures__/actions/async-action.ts";
import { NoPromiseAction } from "@/utils/__fixtures__/actions/no-promise.ts";
`.trim();

    expect(res).toMatch(etalonList);
    expect(res).toMatch(etalonImports);
  });
});
