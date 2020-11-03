/* eslint-disable */
import { ActEventName } from 'act-master';

/**
 * Decorator auto binning on the subscription result.
 * Use only in Vue2 - otherwise there will be no auto unsubscribe,
 * that will cause memory leak.
 *
 */
export function ActSubscribe(eventName: ActEventName) {
  return function (target: any, propName: string) {
    const subscribeHook = {
      created() {

        //@ts-ignore
        this.$act.subscribe(
          eventName,
          (data: any) => {
            //@ts-ignore
            this[propName] = data;
          },
          this
        );
      },
    };

    if ('mixins' in target) {
      target.mixins = [...target.mixins, subscribeHook];
    } else {
      console.log('=>', target);
      target.mixins = [subscribeHook];
    }
  };
}
