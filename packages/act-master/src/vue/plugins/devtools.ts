import { setupDevtoolsPlugin } from '@vue/devtools-api';
import type { App } from 'vue';

import {
  type ActMaster,
  type devActMasterConfig,
  type ActMasterAction,
} from '../..';

import {
  resetMonkeyWatcherState,
  hasMonkeyState,
  watchOnEventsByMonkey,
  getActEventsByMonkeyWatcher,
  isShowActionByConfig,
  toggleSettingsShowCall,
  useSettings,
  sortActInspectorTree,
} from './lib/monkey-watch';
import { debounce, getArguments, logSettings } from './lib/utils';
import type {
  CustomInspectorNode,
  CustomInspectorState,
} from './dev-tools-types';

// #region [ colors ]
// const PINK_500 = 0xec4899;
const BLUE_600 = 0x2563eb;
const LIME_500 = 0x84cc16;
const CYAN_400 = 0x22d3ee;
const ORANGE_400 = 0xfb923c;
const GRAY_100 = 0xf4f4f5;
const DARK = 0x666666;
// #endregion

export function addDevtools(app: App, actMaster: ActMaster) {
  const STATE_TYPE = 'ActMaster';
  const INSPECTOR_ID = 'actMaster';
  // const ACTIONS_LAYER_ID = 'actMaster:action';

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

      // #region [ inspector ]
      const currentSettings = useSettings(api.getSettings());

      logSettings('CALL_FILTER', currentSettings.isShowOnlyCalls);

      api.addInspector({
        id: INSPECTOR_ID,
        label: 'ActMaster 🥷',
        icon: 'gavel',
        treeFilterPlaceholder: 'Filter acts... Change the filter type ⇒',
        stateFilterPlaceholder: ' ',
        actions: [
          {
            icon: 'playlist_add_check',
            action: () => {
              debounce(200, () => {
                toggleSettingsShowCall();
                // Settings are managed internally via useSettings
                // No need to call setSettings as it doesn't exist in the API

                logSettings('CALL_FILTER', currentSettings.isShowOnlyCalls);
              });
            },
            tooltip: 'Toggle show only Acts that have been called',
          },
          {
            icon: 'delete',
            action: () => {
              resetMonkeyWatcherState();
            },
            tooltip: 'Clears the call-state',
          },
        ],
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

      // #endregion
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

  actions.forEach((_, name) => {
    if (!isShowActionByConfig(name)) {
      return;
    }

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

      if (hasMonkeyState(name)) {
        tags.push({
          label: `call`,
          textColor: CYAN_400,
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

  return sortActInspectorTree(list).map((item) => ({
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

  watchOnEventsByMonkey(actMaster);

  let errorHandlerName = act?.$onError || config?.errorHandlerEventName || '❌';
  if (errorHandlerName === actName) {
    errorHandlerName = '';
  }

  const args: string[] = getArguments(act?.exec);

  return {
    [`Act name: "${actName}"`]: [
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
        value: (act?.$watch || []).join(', '),
      },
      {
        key: 'isSingleExec',
        value: act?.$isSingleton || false,
      },
      {
        key: 'validateInput',
        value: act?.$validate || false,
      },
      {
        key: 'arguments',
        value: `(${args.join(', ')})`,
      },
    ],

    'Data passed:': getActEventsByMonkeyWatcher(actName, act),
  };
}

// #endregion
