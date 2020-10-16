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

    vue.act = actMaster;
    vue.prototype.$act = actMaster;
  }

  install(vue: typeof Vue, options?: ActMasterOptions): void {
    VueActMaster.install(vue, options);
  }
}
