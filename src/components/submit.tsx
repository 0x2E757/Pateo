import * as React from "react";
import { Form } from "../form";

type SubmitPropsBase = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export function getSubmitComponent(form: Form) {
    class Component extends React.PureComponent<SubmitPropsBase> {

        private onSubmit = (event: React.ChangeEvent<HTMLInputElement>): void => {
            event.preventDefault();
            form.submit();
        }

        public render = (): JSX.Element => {
            return <input value="Submit" {...this.props} type="submit" form={form.name} onSubmit={this.onSubmit} />;
        }

    }
    Object.defineProperty(Component, "name", { value: "Submit" });
    Object.defineProperty(Component, "displayName", { value: `(${form.name}) Submit` });
    return Component;
}