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
export function ActSubscribe(eventName: ActEventName, pathToData?: string, defaultValue: unknown = null): VueDecorator {
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
