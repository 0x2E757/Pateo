import * as React from "react";
import { Validator, Extend } from "../../types";
import { Form } from "../../forms";
import { getBaseComponent } from "./BaseComponent";

type PropsBase = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

export type FieldProps = {
    validate?: Validator | Validator[],
    initialValue?: any,
    defaultValue?: any,
    component: React.JSXElementConstructor<any>,
};

export function getFieldComponent(form: Form) {
    class FieldComponent extends getBaseComponent<Extend<PropsBase, FieldProps>>(form) {

        public render = (): JSX.Element => {
            const { name, validate, initialValue, defaultValue, component, ...props } = this.props;
            this.updateField(validate, initialValue, defaultValue);
            return React.createElement(component, { field: this.field, ...props });
        }

    }
    Object.defineProperty(FieldComponent, "name", { value: "Field" });
    Object.defineProperty(FieldComponent, "displayName", { value: `(${form.name})(Field)` });
    return FieldComponent;
}