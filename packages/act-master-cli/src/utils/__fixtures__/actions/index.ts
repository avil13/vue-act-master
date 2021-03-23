import { AsyncAction } from './async-action';
import { NoPromiseAction } from './no-promise';
import { optionsAction } from './options-action';

export const actions = [
  new AsyncAction(),
  new NoPromiseAction(),
  optionsAction,
];
