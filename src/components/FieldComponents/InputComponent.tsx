import * as React from "react";
import { Validator, Extend } from "../../types";
import { Form } from "../../forms";
import { getBaseComponent } from "./BaseComponent";

type InputPropsBase = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export type InputProps = {
    validate?: Validator | Validator[],
    initialValue?: string | number,
    defaultValue?: string | number,
};

export function getInputComponent(form: Form) {
    class InputComponent extends getBaseComponent<Extend<InputPropsBase, InputProps>>(form) {

        private onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
            this.field.change(event.target.value);
        }

        public render = (): JSX.Element => {
            const { validate, initialValue, defaultValue, ...props } = this.props;
            this.updateField(validate, initialValue, defaultValue);
            return <input {...props} value={this.field.value ?? ""} onChange={this.onChange} />;
        }

    }
    Object.defineProperty(InputComponent, "name", { value: "Input" });
    Object.defineProperty(InputComponent, "displayName", { value: `(${form.name})(Input)` });
    return InputComponent;
}