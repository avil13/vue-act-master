// #region [ types from devtools-api ]

export interface StateBase {
  key: string;
  value: any;
  editable?: boolean;
  objectType?: 'ref' | 'reactive' | 'computed' | 'other';
  raw?: string;
}
export interface ComponentStateBase extends StateBase {
  type: string;
}
type ComponentBuiltinCustomStateTypes =
  | 'function'
  | 'map'
  | 'set'
  | 'reference'
  | 'component'
  | 'component-definition'
  | 'router'
  | 'store';
export interface CustomState {
  _custom: {
    type: ComponentBuiltinCustomStateTypes | string;
    objectType?: string;
    display?: string;
    tooltip?: string;
    value?: any;
    abstract?: boolean;
    file?: string;
    uid?: number;
    readOnly?: boolean;
    /** Configure immediate child fields */
    fields?: {
      abstract?: boolean;
    };
    id?: any;
    actions?: {
      icon: string;
      tooltip?: string;
      action: () => void | Promise<void>;
    }[];
    /** internal */
    _reviveId?: number;
  };
}
export interface ComponentPropState extends ComponentStateBase {
  meta?: {
    type: string;
    required: boolean;
    /** Vue 1 only */
    mode?: 'default' | 'sync' | 'once';
  };
}
type ComponentState =
  | ComponentStateBase
  | ComponentPropState
  | ComponentCustomState;
export interface ComponentCustomState extends ComponentStateBase {
  value: CustomState;
}

export interface InspectorNodeTag {
  label: string;
  textColor: number;
  backgroundColor: number;
  tooltip?: string;
}
export interface CustomInspectorNode {
  id: string;
  label: string;
  children?: CustomInspectorNode[];
  tags?: InspectorNodeTag[];
  name?: string;
  file?: string;
}
export interface CustomInspectorState {
  [key: string]: (StateBase | Omit<ComponentState, 'type'>)[];
}
// #endregion
