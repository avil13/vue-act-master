import { it, expect, describe } from 'vitest';
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
  ])('getInterfaceContent(%s)', async (expected) => {
    const items = getItems('../../__fixtures__/**/*ts');

    const res = await makeInterfaceContent('path/to/interface.d.ts', items);

    expect(res).toMatch(expected);
  });

  it('getInterfaceContent WITH PREFIX', async () => {
    const prefix = '// IS GENERATED!\n\n';

    const items = getItems('../../__fixtures__/**/*ts');

    const res = await makeInterfaceContent(
      'path/to/interface.d.ts',
      items,
      false,
      prefix
    );

    expect(res).toContain(prefix);
  });

  it('getIndexContent', async () => {
    const prefix = '// IS GENERATED!\n\n';
    const items = getItems('../../__fixtures__/**/*ts');

    const res = await makeIndexContent(
      'path/to/action.ts',
      items,
      false,
      prefix
    );

    const etalonList = `
export const actions: ActMasterAction[] = [
  new AsyncAction(),
  new NoPromiseAction(),
  new WithOtherTypeReturn(),
];
`;

    const etalonImports = `
import { ActMasterAction } from "act-master";
import { AsyncAction } from "@/utils/__fixtures__/actions/async-action";
import { NoPromiseAction } from "@/utils/__fixtures__/actions/no-promise";
import { WithOtherTypeReturn } from "@/utils/__fixtures__/actions/with-other-type-return"
`.trim();

    expect(res).toContain(etalonList);
    expect(res).toContain(etalonImports);
    expect(res).toContain(prefix);
  });
});
