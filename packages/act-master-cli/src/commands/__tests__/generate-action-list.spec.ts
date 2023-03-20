import { it, expect } from 'vitest';
import { generateActionList } from '../generate-action-list';

it('generateActionList [1]', async () => {
  const content = await generateActionList();

  expect(content).toContain(getContent());
});

function getContent() {
  return `
import { ActMasterAction, Acts, Names, Subs } from "act-master";
import { AsyncAction } from "@/utils/__fixtures__/actions/async-action";
import { NoPromiseAction } from "@/utils/__fixtures__/actions/no-promise";
import { WithOtherTypeReturn } from "@/utils/__fixtures__/actions/with-other-type-return";

/* This is generated file */
export const actions: ActMasterAction[] = [
  new AsyncAction(),
  new NoPromiseAction(),
  new WithOtherTypeReturn(),
];

declare module 'act-master' {
  export interface ActGenerated {
    acts: Acts<typeof actions>;
    subs: Subs<typeof actions>;
    names: Names<typeof actions>;
  }
}`.trim();
}
