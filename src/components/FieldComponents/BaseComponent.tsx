import * as React from "react";
import { Extend, Validator } from "../../types";
import { Form, Field } from "../../forms";

export type BaseProps = {
    name: string,
};

export function getBaseComponent<P, S = {}>(form: Form) {
    class BaseComponent extends React.PureComponent<Extend<P, BaseProps>, S> {

        protected field: Field;

        constructor(props: Extend<P, BaseProps>) {
            super(props);
            this.field = form.getField(props.name);
        }

        private fourceUpdateWrapper = (): void => {
            this.forceUpdate();
        }

        protected updateField = (validate?: Validator | Validator[], initialValue?: any, defaultValue?: any): void => {
            this.field.unsubscribe(this.fourceUpdateWrapper);
            if (this.field.name !== this.props.name)
                this.field = form.getField(this.props.name);
            this.field.setValidators(validate === undefined ? [] : Array.isArray(validate) ? validate : [validate]);
            this.field.setInitialValue(initialValue);
            this.field.setDefaultValue(defaultValue);
            this.field.subscribe(this.fourceUpdateWrapper);
        }

        public componentWillUnmount = (): void => {
            this.field.unsubscribe(this.fourceUpdateWrapper);
        }

    }
    Object.defineProperty(BaseComponent, "name", { value: "Field Base" });
    Object.defineProperty(BaseComponent, "displayName", { value: `(${form.name})(Field Base)` });
    return BaseComponent;
}