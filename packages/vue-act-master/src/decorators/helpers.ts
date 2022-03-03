import { ComponentOptions } from 'vue';

type Vue = any;

type VueClass<V> = { new (...args: any[]): V & Vue } & any;

type DecoratedClass = VueClass<Vue> & {
  // Property, method and parameter decorators created by `createDecorator` helper
  // will enqueue functions that update component options for lazy processing.
  // They will be executed just before creating component constructor.
  __decorators__?: ((options: ComponentOptions<Vue>) => void)[];
};

export interface VueDecorator {
  // Class decorator
  (Ctor: any): void;

  // Property decorator
  (target: Vue, key: string): void;

  // Parameter decorator
  (target: Vue, key: string, index: number): void;
}

export function createDecorator(
  factory: (options: ComponentOptions<Vue>, key: string, index: number) => void
): VueDecorator {
  return (target: Vue | any, key?: any, index?: any) => {
    const Ctor =
      typeof target === 'function'
        ? (target as DecoratedClass)
        : (target.constructor as DecoratedClass);
    if (!Ctor.__decorators__) {
      Ctor.__decorators__ = [];
    }
    if (typeof index !== 'number') {
      index = undefined;
    }
    Ctor.__decorators__.push((options: any) => factory(options, key, index));
  };
}

export function objectPath(
  obj: any,
  path: string | null,
  defaultValue: unknown
) {
  let value = obj;

  if (path) {
    const list = path.split('.');
    let key;
    let i = 0;
    for (i = 0; i < list.length && value; i++) {
      key = list[i];
      value = value[key];
    }
  }

  if (value === undefined) {
    return defaultValue;
  }

  return value;
}
