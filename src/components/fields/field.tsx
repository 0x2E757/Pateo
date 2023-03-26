import * as React from "react";
import { Validator, Extend } from "../../types";
import { Form } from "../../form";
import { getBaseComponent } from "./base";

type PropsBase = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

interface IFieldProps {
    validate?: Validator | Validator[];
    initialValue?: any;
    defaultValue?: any;
    component: React.JSXElementConstructor<any>;
}

export function getFieldComponent(form: Form) {
    class FieldComponent extends getBaseComponent<Extend<PropsBase, IFieldProps>>(form) {

        public render = (): JSX.Element => {
            const { name, validate, initialValue, defaultValue, component, ...props } = this.props;
            this.updateField();
            this.field.setValidators(validate === undefined ? [] : Array.isArray(validate) ? validate : [validate]);
            this.field.setInitialValue(initialValue);
            this.field.setDefaultValue(defaultValue);
            return React.createElement(component, { field: this.field, ...props });
        }

    }
    Object.defineProperty(FieldComponent, "name", { value: "Field" });
    Object.defineProperty(FieldComponent, "displayName", { value: `(${form.name})(Field)` });
    return FieldComponent;
}