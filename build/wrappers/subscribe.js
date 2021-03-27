"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribe = void 0;
const subscribe = (...wrappers) => {
    return (component) => {
        class WrappedComponent extends component {
            constructor(...args) {
                super(...args);
                const forceUpdateWrapper = () => this.forceUpdate();
                const initialComponentDidMount = this.componentDidMount;
                const initialComponentWillUnmount = this.componentWillUnmount;
                this.componentDidMount = () => {
                    for (const wrapper of wrappers)
                        wrapper.subscribe(forceUpdateWrapper);
                    if (initialComponentDidMount)
                        initialComponentDidMount();
                };
                this.componentWillUnmount = () => {
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
    };
};
exports.subscribe = subscribe;
//# sourceMappingURL=subscribe.js.map