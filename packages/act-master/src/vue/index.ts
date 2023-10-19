import { ActMaster, ActMasterOptions } from '../act-master';

export * from './decorators';

/**
 * Declaration vue2
 *
 */
//@ts-ignore
declare module 'vue/types/vue' {
  interface Vue {
    $act: ActMaster;
  }

  interface VueConstructor {
    act: ActMaster;
  }
}

/**
 * Declaration vue3
 *
 */
//@ts-ignore
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    /**
     * Normalized current location. See {@link RouteLocationNormalizedLoaded}.
     */
    $act: ActMaster;
  }
}

export class VueActMaster {
  static instance: ActMaster | null = null;

  static install(vue: any, options?: ActMasterOptions): void {
    const actMaster = new ActMaster({
      autoUnsubscribeCallback({ context, eventName, listener }) {
        if (context && typeof context === 'function') {
          // vue 3
          context(function () {
            actMaster.unsubscribe(eventName, listener);
          });
        } else if (context && typeof context.$once === 'function') {
          // vue 2
          context.$once('hook:beforeDestroy', () => {
            actMaster.unsubscribe(eventName, listener);
          });
        }
      },
      ...options,
    });

    VueActMaster.instance = actMaster;

    // add the instance method
    if (vue.config?.globalProperties && !vue.config.globalProperties.$act) {
      // vue 3
      vue.config.globalProperties.$act = actMaster;
      vue.provide('$act', actMaster);
    } else if (!Object.prototype.hasOwnProperty.call(vue, '$act')) {
      // vue 2
      vue.act = actMaster;
      vue.prototype.$act = actMaster;
    }
  }

  install(vue: any, options?: ActMasterOptions): void {
    VueActMaster.install(vue, options);
  }
}
