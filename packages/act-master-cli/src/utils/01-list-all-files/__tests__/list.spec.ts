import { it, expect } from 'vitest';
import { getSourcesByPath } from '..';

it('all files', () => {
  const ctx = getSourcesByPath(['../../__fixtures__/**/*.ts'], __dirname);

  expect(ctx.length).toBe(6);
});
