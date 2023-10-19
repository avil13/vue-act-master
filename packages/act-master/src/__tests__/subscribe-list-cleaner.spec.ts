import { beforeEach, describe, expect, it } from 'vitest';
import { ActTest } from '../test-utils';

const $act = ActTest.getInstance();

beforeEach(() => {
  ActTest.resetAll();
});

describe('Subscribe list cleaner', () => {
  it('Adding come subscriptions in different keys', () => {
    const action = ActTest.makeActionStub({ name: 'ACT_1' });
    ActTest.addActions([action]);

    $act.subsList.add(this);

    $act.subscribe('ACT_1', () => null);
    $act.subscribe('ACT_1', () => null);

    expect(ActTest.entityCount('listeners')).toBe(2);

    $act.subsList.clear(this);

    expect(ActTest.entityCount('listeners')).toBe(0);
  });
});
