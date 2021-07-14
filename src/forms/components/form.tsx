import * as React from "react";
import { Extend, DeepReadonlyPartial, Constructor } from "../../types";
import { Form } from "../form";

type IFormProps<T> = Extend<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, {
    onSubmit: (values: DeepReadonlyPartial<T>) => void;
}>

export type FormComponent<T> = Constructor<React.PureComponent<IFormProps<T>>>;

export function getFormComponent<T>(form: Form<T>): FormComponent<T> {
    class Component extends React.PureComponent<IFormProps<T>> {

        public onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
            event.preventDefault();
            form.submit(this.props.onSubmit);
        }

        public render = (): JSX.Element => {
            return <form {...this.props} name={form.name} onSubmit={this.onSubmit} />;
        }

    }
    Object.defineProperty(Component, "name", { value: "Form" });
    Object.defineProperty(Component, "displayName", { value: "Form" });
    return Component;
}