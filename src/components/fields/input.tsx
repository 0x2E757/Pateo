import * as React from "react";
import { Form } from "../../form";
import { getBaseComponent } from "./base";

type InputPropsBase = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export function getInputComponent(form: Form) {
    class InputComponent extends getBaseComponent<InputPropsBase>(form) {

        private onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
            this.field.change(event.target.value);
        }

        public render = (): JSX.Element => {
            this.updateField();
            return <input {...this.props} value={this.field.value ?? ""} onChange={this.onChange} />;
        }

    }
    Object.defineProperty(InputComponent, "name", { value: "Input" });
    Object.defineProperty(InputComponent, "displayName", { value: `(${form.name}) Input` });
    return InputComponent;
}