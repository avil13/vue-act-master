/* eslint-disable */
import { ActEventName } from '../../act-master';
import type { ComponentOptions } from 'vue';
import { createDecorator, VueDecorator } from './helpers';

/**
 * Decorator auto binning on the subscription result.
 * Use only in Vue2 - otherwise there will be no auto unsubscribe,
 * that will cause memory leak.
 *
 */
export function ActSubscribe(
  eventName: ActEventName,
  pathToData?: PathToData,
  defaultValue: unknown = null
): VueDecorator {
  return createDecorator((componentOptions, key) => {
    const subscribeHook = {
      created() {
        //@ts-ignore
        this.$act.subscribe(
          eventName,
          (data: any) => {
            const value = objectPath(data, pathToData, defaultValue);

            //@ts-ignore
            if (typeof this[key] === 'function') {
              //@ts-ignore
              this[key](value);
            } else {
              //@ts-ignore
              this[key] = value;
            }
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

type GetValueCallback = (value: any) => any;

type PathToData = string | null | GetValueCallback;

function objectPath(obj: any, path?: PathToData, defaultValue?: unknown) {
  if (obj === undefined) {
    return defaultValue;
  }

  if (typeof path === 'function') {
    return path(obj);
  }

  let value = obj;

  if (path) {
    const list = (path || '').split('.');
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
