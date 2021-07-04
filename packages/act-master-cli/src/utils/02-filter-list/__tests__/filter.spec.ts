import { actionFilter } from '..';
import { getSourcesByPath } from '../../01-list-all-files';

it('filter files', () => {
  const listFiles = getSourcesByPath(['../../__fixtures__/**/*.ts'], __dirname);

  const list = listFiles.filter((item) => actionFilter(item));

  expect(list.length).toBe(3);
});
