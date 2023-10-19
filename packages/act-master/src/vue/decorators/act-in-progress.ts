/* eslint-disable */
import { ActEventName } from '../../act-master';
import { ComponentOptions } from 'vue';
import { createDecorator, VueDecorator } from './helpers';

/**
 * Decorator auto binning on the subscription result.
 * Use only in Vue2 - otherwise there will be no auto unsubscribe,
 * that will cause memory leak.
 *
 */
export function ActInProgress(eventName: ActEventName | ActEventName[]): VueDecorator {
  return createDecorator((componentOptions, key) => {
    const inProgressHook = {
      created() {
        //@ts-ignore
        const unsubscribe = this.$act.inProgress(eventName, (inProgress) => {
          //@ts-ignore
          this[key] = inProgress;
        });

        //@ts-ignore
        this.$once('hook:beforeDestroy', () => {
          unsubscribe(eventName);
        });
      },
    };

    if (componentOptions.mixins) {
      componentOptions.mixins = [...componentOptions.mixins, inProgressHook];
    } else {
      componentOptions.mixins = [inProgressHook];
    }
  });
}
