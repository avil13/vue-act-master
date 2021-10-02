/* eslint-disable */
import { ActEventName } from 'act-master';
import { ComponentOptions } from 'vue';
import * as Vue from 'vue/types/umd';
import { createDecorator, VueDecorator } from './helpers';

/**
 * Decorator auto binning on the subscription result.
 * Use only in Vue2 - otherwise there will be no auto unsubscribe,
 * that will cause memory leak.
 *
 */
export function ActSubscribe(eventName: ActEventName, pathToData?: PathToData, defaultValue: unknown = null): VueDecorator {
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

type GetValueCallback = (value: any) => any;

type PathToData = string | null | GetValueCallback

function objectPath(obj: any, path: PathToData, defaultValue: unknown) {
  if (typeof path === 'function') {
    return path(obj);
  }

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
