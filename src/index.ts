import * as React from "react";

import { PromiseExt } from "@0x2e757/promise-ext";
export { PromiseExt };

import { IWrapper, StaticWrapper, IStaticWrapper, DynamicWrapper, IDynamicWrapper } from "@0x2e757/wrappers";
export type { IWrapper, IStaticWrapper, IDynamicWrapper };
export { StaticWrapper, DynamicWrapper };

import { Constructor, ISubscribable } from "./types";
export type { Constructor, ISubscribable };

import { Form } from "./form";
export { Form };

import { Field } from "./field";
export { Field };

export const subscribe = (...subscribables: ISubscribable[]) => {
    return <T extends Constructor<React.Component>>(component: T): T => {
        class SubscribedComponent extends component {
            constructor(...args: any[]) {

                super(...args);

                const forceUpdateWrapper = (): void => this.forceUpdate();
                const initialComponentDidMount = this.componentDidMount;
                const initialComponentWillUnmount = this.componentWillUnmount;

                this.componentDidMount = (): void => {
                    for (const wrapper of subscribables)
                        wrapper.subscribe(forceUpdateWrapper);
                    if (initialComponentDidMount)
                        initialComponentDidMount();
                };

                this.componentWillUnmount = (): void => {
                    for (const wrapper of subscribables)
                        wrapper.unsubscribe(forceUpdateWrapper);
                    if (initialComponentWillUnmount)
                        initialComponentWillUnmount();
                };

            }
        }
        Object.defineProperty(SubscribedComponent, "name", { value: component.name });
        Object.defineProperty(SubscribedComponent, "displayName", { value: `(Subscribed)(${component.name})` });
        return SubscribedComponent;
    }
}

export default {
    PromiseExt,
    StaticWrapper,
    DynamicWrapper,
    Form,
    Field,
    subscribe,
};