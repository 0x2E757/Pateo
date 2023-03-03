import * as React from "react";
import { Extend } from "../../types";
import { Form } from "../../form";
import { getBaseComponent } from "./base";

type InputPropsBase = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

interface IInputProps {
    initialValue?: string | number;
    defaultValue?: string | number;
}

export function getInputComponent(form: Form) {
    class InputComponent extends getBaseComponent<Extend<InputPropsBase, IInputProps>>(form) {

        private onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
            this.field.change(event.target.value);
        }

        public render = (): JSX.Element => {
            const { initialValue, defaultValue, ...props } = this.props;
            this.updateField();
            this.field.setInitialValue(initialValue);
            this.field.setDefaultValue(defaultValue);
            return <input {...props} value={this.field.value ?? ""} onChange={this.onChange} />;
        }

    }
    Object.defineProperty(InputComponent, "name", { value: "Input" });
    Object.defineProperty(InputComponent, "displayName", { value: `(${form.name})(Input)` });
    return InputComponent;
}