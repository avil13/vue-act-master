/* eslint-disable */
import { ActEventName } from 'act-master';
import { ComponentOptions } from 'vue';
import * as Vue from 'vue/types/umd';

/**
 * Decorator auto binning on the subscription result.
 * Use only in Vue2 - otherwise there will be no auto unsubscribe,
 * that will cause memory leak.
 *
 */
export function ActSubscribe(eventName: ActEventName, pathToData?: string, defaultValue: unknown = null) {
  return createDecorator((componentOptions, key) => {
    const subscribeHook = {
      created() {
        //@ts-ignore
        this.$act.subscribe(
          eventName,
          (data: any) => {
            //@ts-ignore
            this[key] = (pathToData && objectPath(data, pathToData, defaultValue)) || (data !== undefined && data) || defaultValue;
          },
          this
        );
      },
    };

    if (componentOptions.mixins) {
      componentOptions.mixins = [...componentOptions.mixins, subscribeHook];
    } else {
      componentOptions.mixins = [subscribeHook];
    }
  });
}


// helpers

type VueClass<V> = { new(...args: any[]): V & Vue } & typeof Vue

type DecoratedClass = VueClass<Vue> & {
  // Property, method and parameter decorators created by `createDecorator` helper
  // will enqueue functions that update component options for lazy processing.
  // They will be executed just before creating component constructor.
  __decorators__?: ((options: ComponentOptions<Vue>) => void)[]
}

interface VueDecorator {
  // Class decorator
  (Ctor: typeof Vue): void

  // Property decorator
  (target: Vue, key: string): void

  // Parameter decorator
  (target: Vue, key: string, index: number): void
}

export function createDecorator(
  factory: (options: ComponentOptions<Vue>, key: string, index: number) => void
): VueDecorator {
  return (target: Vue | typeof Vue, key?: any, index?: any) => {
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

function objectPath(obj: any, path: string | null, defaultValue: unknown) {
  let value = obj;

  if (path) {
    const list = path.split('.');
    let key;
    let i = 0;
    for (i=0; i < list.length; i++) {
        key = list[i];
      value = value[key];
      if (value === undefined) {
        value = defaultValue;
        break;
      }
    }
  }

  return value;
};

