export type TransformerFn = (value: any) => any | Promise<any>;

export interface ActMasterAction {
  new (): void;
  name: string;
  exec(...args: any[]): Promise<any>;
  // history?: boolean;
  transform?: TransformerFn;
}

export interface VueActMasterOptions {
  actions: {
    [key: string]: ActMasterAction;
  };
}
