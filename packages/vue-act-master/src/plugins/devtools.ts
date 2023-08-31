import {
  setupDevtoolsPlugin,
  type App,
  type CustomInspectorNode,
  type CustomInspectorState,
} from '@vue/devtools-api';

import {
  ActMaster,
  devActMasterConfig,
  type ActMasterAction,
} from 'act-master';

// #region [ colors ]
// const PINK_500 = 0xec4899;
// const BLUE_600 = 0x2563eb;
const LIME_500 = 0x84cc16;
// const CYAN_400 = 0x22d3ee;
const ORANGE_400 = 0xfb923c;
// const GRAY_100 = 0xf4f4f5
const DARK = 0x666666;
// #endregion

export function addDevtools(app: App, actMaster: ActMaster) {
  const STATE_TYPE = 'ActMaster';
  const INSPECTOR_ID = 'actMaster';

  setupDevtoolsPlugin(
    {
      id: 'com.avil13',
      app,
      label: 'Act Master',
      packageName: 'act-master',
      homepage: 'https://avil13.github.io/vue-act-master/',
      logo: 'https://avil13.github.io/vue-act-master/assets/act-master-logo.svg',
      componentStateTypes: [STATE_TYPE],
    },
    (api) => {
      // Use the API here

      api.addInspector({
        id: INSPECTOR_ID,
        label: 'ActMaster 🥷',
        icon: 'gavel',
        treeFilterPlaceholder: 'Filter acts...',
        stateFilterPlaceholder: ' ',
      });

      api.on.getInspectorTree((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          payload.rootNodes = getActInspectorTree(actMaster, payload.filter);
        }
      });

      api.on.getInspectorState((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          payload.state = getActInspectorState(actMaster, payload.nodeId);
        }
      });
    }
  );
}

// #region [ HELPERS ]

function getActInspectorTree(
  actMaster: ActMaster,
  filter: string
): CustomInspectorNode[] {
  const list: CustomInspectorNode[] = [];

  //@ts-ignore
  const actions = actMaster._actions as Map<string, (...a: any[]) => any>;
  //@ts-ignore
  const config = actMaster.config as devActMasterConfig;
  //@ts-ignore
  const subMap = actMaster._listeners as Map<ActEventName, ListenerFunction[]>;

  const errorHandlerName = config.errorHandlerEventName || '';
  const filterLower = filter.toLowerCase();
  let maxLen = 0;

  actions.forEach((fn, name) => {
    if (name.length > maxLen) {
      maxLen = name.length;
    }

    if (name.toLowerCase().includes(filterLower)) {
      const subs = subMap.get(name) || [];

      const tags = [
        {
          label: `subs: ${subs.length}`,
          textColor: LIME_500,
          backgroundColor: DARK,
        },
      ];

      if (errorHandlerName === name) {
        tags.push({
          label: 'Error Handler',
          textColor: ORANGE_400,
          backgroundColor: DARK,
        });
      }

      list.push({
        id: name,
        label: name,
        tags,
      });
    }
  });

  maxLen += 2;

  return list
    .sort((a, b) => (a.id > b.id ? 1 : -1))
    .map((item) => ({
      ...item,
      label: item.label.padEnd(maxLen, ' '),
    }));
}

export function getActInspectorState(
  actMaster: ActMaster,
  actName: string
): CustomInspectorState {
  //@ts-ignore
  const act = actMaster._actions.get(actName) as ActMasterAction | null;
  //@ts-ignore
  const config = actMaster.config as devActMasterConfig;
  //@ts-ignore
  const subsMap = actMaster._listeners as Map<ActEventName, ListenerFunction[]>;

  const subs = subsMap.get(actName) || [];

  let errorHandlerName =
    act?.errorHandlerEventName || config?.errorHandlerEventName || '❌';
  if (errorHandlerName === actName) {
    errorHandlerName = '';
  }

  const fnBody = act?.exec.toString();
  const argRegExp = /[^\(]*\(([^\)]*)\)/;
  const match = fnBody?.match(argRegExp);
  let args: string[] = [];

  if (match && match[1]) {
    args = match[1]
      .split(',')
      .map((arg) => arg.trim())
      .filter((arg) => arg.length > 0);
  }

  return {
    [actName]: [
      {
        key: 'subscribers',
        value: subs.length,
      },
      {
        key: 'errorHandlerEventName',
        value: errorHandlerName,
        // raw: 'string;'
      },
      {
        key: 'watch',
        value: (act?.watch || []).join(', '),
      },
      {
        key: 'isSingleExec',
        value: act?.isSingleExec ? 'true' : 'false',
      },
      {
        key: 'validateInput',
        value: act?.validateInput ? 'true' : 'false',
      },
      {
        key: 'arguments',
        value: `(${args.join(', ')})`,
      },
    ],
  };
}

// #endregion
