import { expect, it, vi } from 'vitest';
import { getStaticContentFromFile } from '../file-helper';

vi.mock('fs/promises', () => {
  return {
    async stat() {
      return {
        isFile: () => true,
      };
    },
    async readFile() {
      return `
Bad Line
/* staticStart */
Hello world!
/* staticEnd */

Bad Line again
      `;
    },
    unlink() {
      return;
    },
  };
});

it('getStaticContentFromFile', async () => {
  const staticCtx = await getStaticContentFromFile('some/path');

  const etalon = `/* staticStart */
Hello world!
/* staticEnd */`;

  expect(staticCtx.isExist).toBe(true);
  expect(staticCtx.content).toBe(etalon);
});
