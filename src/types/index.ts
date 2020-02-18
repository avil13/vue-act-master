export interface TransformClass {
  new (value: any): any;
}

export interface ActMasterAction {
  new (): void;
  name: string;
  exec(...args: any[]): any;
  history?: boolean;
  transform?: TransformClass;
}

export interface VueActMasterOptions {
  actions: {
    [key: string]: ActMasterAction;
  };
}
