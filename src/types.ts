export type Extend<T, U> = Omit<T, keyof U> & U;
export type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends Function ? T[K] : T[K] extends {} ? DeepReadonly<T[K]> : T };
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends Function ? T[K] : T[K] extends {} ? DeepPartial<T[K]> : T };
export type DeepReadonlyPartial<T> = { readonly [K in keyof T]?: T[K] extends Function ? T[K] : T[K] extends {} ? DeepReadonlyPartial<T[K]> : T };

export type Constructor<T = any> = { new(...args: any[]): T };
export type Subscriber<T = any> = (value: T) => void;