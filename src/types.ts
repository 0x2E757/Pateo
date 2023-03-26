export type Extend<T, U> = Omit<T, keyof U> & U;
export type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends Function ? T[K] : T[K] extends {} ? DeepReadonly<T[K]> : T };
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends Function ? T[K] : T[K] extends {} ? DeepPartial<T[K]> : T };
export type DeepReadonlyPartial<T> = { readonly [K in keyof T]?: T[K] extends Function ? T[K] : T[K] extends {} ? DeepReadonlyPartial<T[K]> : T };

export type Constructor<T = any> = { new(...args: any[]): T };
export type Subscriber<T = any> = (value: T) => void;

export type Validator = (value: any) => string | undefined;
export type ValidationErrors = { [key: string]: string | string[] };

export interface ISubscribable<T = any> {
    subscribe: (subscriber: Subscriber<T>) => void;
    unsubscribe: (subscriber: Subscriber<T>) => void;
}