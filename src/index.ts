import * as React from "react";
import { Constructor, ISubscribable } from "./types";

export type { IWrapper, IStaticWrapper, IDynamicWrapper } from "@0x2e757/wrappers";

export { StaticWrapper, DynamicWrapper } from "@0x2e757/wrappers";
export { Form } from "./form";
export { Field } from "./field";

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
        Object.defineProperty(SubscribedComponent, "displayName", { value: `Subscribed (${component.name})` });
        return SubscribedComponent;
    }
}