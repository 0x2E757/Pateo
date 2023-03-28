import * as React from "react";
import { Extend, DeepReadonlyPartial } from "../types";
import { Form } from "../forms";

type FormPropsBase = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export type FormProps<T> = {
    onSubmit?: (values: DeepReadonlyPartial<T>) => void,
};

export function getFormComponent<T>(form: Form<T>) {
    class FormComponent extends React.PureComponent<Extend<FormPropsBase, FormProps<T>>> {

        private updateFormParams = (): void => {
            if (this.props.onSubmit !== undefined)
                form.onSubmit = this.props.onSubmit;
        }

        private onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
            event.preventDefault();
            form.submit();
        }

        public componentDidMount = (): void => {
            this.updateFormParams();
        }

        public componentDidUpdate = (): void => {
            this.updateFormParams();
        }

        public render = (): JSX.Element => {
            const { onSubmit, ...props } = this.props;
            return <form {...props} id={form.name} onSubmit={this.onSubmit} />;
        }

    }
    Object.defineProperty(FormComponent, "name", { value: "Form" });
    Object.defineProperty(FormComponent, "displayName", { value: `(${form.name})(Form)` });
    return FormComponent;
}