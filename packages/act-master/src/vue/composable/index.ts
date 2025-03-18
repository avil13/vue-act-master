import { onBeforeMount, onBeforeUnmount, ref, type App, type Ref } from 'vue';
import type { ActMaster } from '../../act-master';
import type { ActEventName, ActGenerated, ActMasterAction } from '../../types';

//
type IsFn<T> = T extends (...args: any) => any ? T : never;
type UnPromise<T> = T extends Promise<infer U> ? U : T;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;
type Fn = (...args: any) => any;

type SubFnFromAct<LS extends ActMasterAction[]> = LS extends (infer A)[]
  ? UnionToIntersection<RefFuncFromAct<A extends ActMasterAction ? A : never>>
  : never;

export type RefFuncFromAct<T extends { name: string; exec: Fn }> = T extends {
  readonly name: infer N;
  readonly exec: infer F;
}
  ? (name: N) => Ref<UnPromise<ReturnType<IsFn<F>>>>
  : never;

type _SubFnFromAct<K = 'actionList'> = K extends keyof ActGenerated
  ? ActGenerated[K]
  : never;

export type RefSubscriptionFunction = SubFnFromAct<_SubFnFromAct>;

export function refSubscribeFactory(amContainer: {
  actMaster: ActMaster | null;
  app: App;
}): RefSubscriptionFunction {
  // @ts-ignore
  const useRefSubscription: RefSubscriptionFunction = (name: ActEventName) => {
    const { actMaster, app } = amContainer;

    if (!actMaster) {
      throw new Error('VueActMaster not initialized');
    }

    if (parseFloat(app.version) < 3.3) {
      throw new Error('You need Vue version 3.3 or more');
    }

    const refValue = ref(null);

    const callback = (data: any) => {
      refValue.value = data;
    };

    onBeforeMount(() => {
      actMaster.on(name, callback);
    });

    onBeforeUnmount(() => {
      actMaster.off(name, callback);
    });

    return refValue;
  };

  return useRefSubscription;
}

export function autoUnsubscribeFactory(amContainer: {
  actMaster: ActMaster | null;
  app: App;
}) {
  return function useAutoUnsubscribe(key = '') {
    const uniqueKey = key || Math.floor(Math.random() * 1000) + Date.now();
    const { actMaster } = amContainer;

    if (!actMaster) {
      throw new Error('VueActMaster not initialized');
    }

    actMaster.subsList.add(uniqueKey);

    onBeforeUnmount(() => actMaster.subsList.clear(uniqueKey));
  };
}
