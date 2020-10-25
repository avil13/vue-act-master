import { ActMaster, ActMasterOptions } from 'act-master';
import Vue, { PluginObject } from 'vue';

export * from 'act-master';

/**
 * Declaration
 *
 */
declare module 'vue/types/vue' {
  interface Vue {
    $act: ActMaster;
  }

  interface VueConstructor {
    act: ActMaster;
  }
}

export class VueActMaster implements PluginObject<ActMasterOptions> {
  static install(vue: typeof Vue, options?: ActMasterOptions): void {
    const actMaster = new ActMaster({
      autoUnsubscribeCallback({ context, eventName, listener }) {
        if (context) {
          context.$once('hook:beforeDestroy', () => {
            actMaster.unsubscribe(eventName, listener);
          });
        }
      },
      ...options,
    });

    // add the instance method
    //@ts-ignore
    if (vue.config?.globalProperties && !vue.config.globalProperties.$act) {
      // vue 3
      //@ts-ignore
      vue.config.globalProperties.$act = actMaster;
      //@ts-ignore
      vue.provide('$act', actMaster);
    } else if (!Object.prototype.hasOwnProperty.call(vue, '$act')) {
      // vue 2
      vue.act = actMaster;
      vue.prototype.$act = actMaster;
    }
  }

  install(vue: typeof Vue, options?: ActMasterOptions): void {
    VueActMaster.install(vue, options);
  }
}
