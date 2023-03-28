import * as React from "react";
import { Constructor, ISubscribable } from "../types";

export const subscribe = (...subscribables: ISubscribable[]) => {
    return <T extends Constructor<React.Component>>(component: T): T => {
        class SubscribedComponent extends component {
            constructor(...args: any[]) {

                super(...args);

                const forceUpdateWrapper = (): void => this.forceUpdate();
                const initialComponentDidMount = this.componentDidMount;
                const initialComponentWillUnmount = this.componentWillUnmount;
                const initialRender = this.render;

                let updatedWhileRender = false;
                const updatedWhileRenderSetter = () => updatedWhileRender = true;

                this.componentDidMount = (): void => {
                    for (const wrapper of subscribables)
                        wrapper.unsubscribe(updatedWhileRenderSetter);
                    if (updatedWhileRender)
                        this.forceUpdate();
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

                this.render = (): React.ReactNode => {
                    for (const wrapper of subscribables)
                        wrapper.subscribe(updatedWhileRenderSetter);
                    return initialRender();
                };

            }
        }
        Object.defineProperty(SubscribedComponent, "name", { value: component.name });
        Object.defineProperty(SubscribedComponent, "displayName", { value: `(Subscribed)(${component.name})` });
        return SubscribedComponent;
    }
}