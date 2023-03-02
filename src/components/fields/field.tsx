import * as React from "react";
import { Extend } from "../../types";
import { Form } from "../../form";
import { Field } from "../../field";
import { getBaseComponent } from "./base";

type PropsBase = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

interface IFieldProps {
    name: string;
    component: React.ComponentClass<{ field: Field }>;
}

export function getFieldComponent(form: Form) {
    class FieldComponent extends getBaseComponent<Extend<PropsBase, IFieldProps>>(form) {

        public render = (): JSX.Element => {
            this.updateField();
            const { component, ...props } = this.props;
            return React.createElement(component, { field: this.field, ...props });
        }

    }
    Object.defineProperty(FieldComponent, "name", { value: "Field" });
    Object.defineProperty(FieldComponent, "displayName", { value: `(${form.name})(Field)` });
    return FieldComponent;
}