import * as React from "react";

import { IWrapper, StaticWrapper, IStaticWrapper, DynamicWrapper, IDynamicWrapper } from "@0x2e757/wrappers";
export { IWrapper, StaticWrapper, IStaticWrapper, DynamicWrapper, IDynamicWrapper };

import { Constructor, ISubscribable } from "./types";
export { Constructor, ISubscribable };

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
    StaticWrapper, 
    DynamicWrapper,
    Form,
    Field,
    subscribe,
};