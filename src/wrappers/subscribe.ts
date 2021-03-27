import * as React from "react";
import { IWrapper } from "@0x2e757/wrappers";
import { Constructor } from "../types";

export const subscribe = (...wrappers: IWrapper<any>[]) => {
    return <T extends Constructor<React.Component>>(component: T): T => {
        class WrappedComponent extends component {
            constructor(...args: any[]) {

                super(...args);

                const forceUpdateWrapper = (): void => this.forceUpdate();
                const initialComponentDidMount = this.componentDidMount;
                const initialComponentWillUnmount = this.componentWillUnmount;

                this.componentDidMount = (): void => {
                    for (const wrapper of wrappers)
                        wrapper.subscribe(forceUpdateWrapper);
                    if (initialComponentDidMount)
                        initialComponentDidMount();
                };

                this.componentWillUnmount = (): void => {
                    for (const wrapper of wrappers)
                        wrapper.unsubscribe(forceUpdateWrapper);
                    if (initialComponentWillUnmount)
                        initialComponentWillUnmount();
                };

            }
        }
        Object.defineProperty(WrappedComponent, "name", { value: component.name });
        Object.defineProperty(WrappedComponent, "displayName", { value: `Subscribed(${component.name})` });
        return WrappedComponent;
    }
}