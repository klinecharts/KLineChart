interface Utils {
  clone: (target: any) => void;
  merge: (target: any, source: any) => void;
  isString: (value: any) => boolean;
  isNumber: (value: any) => boolean;
  isValid: (value: any) => boolean;
  isObject: (value: any) => boolean;
  isArray: (value: any) => boolean;
  isFunction: (value: any) => boolean;
  isBoolean: (value: any) => boolean;
  formatValue: (data: any, key: any, defaultValue?: any) => any;
  formatPrecision: (value: number, precision?: number) => string;
  formatBigNumber: (value: number) => string;
}

export declare const utils: Utils;
