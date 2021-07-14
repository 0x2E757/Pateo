import * as React from "react";
import { Extend, Constructor } from "../../types";
import { Form } from "../form";
import { Field } from "../field";

type IFieldProps = Extend<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, {
    name: string;
}>

export type FieldComponent = Constructor<React.PureComponent<IFieldProps>>;

export function getFieldComponent(form: Form): FieldComponent {
    class Component extends React.PureComponent<IFieldProps> {

        private field: Field;

        constructor(props: IFieldProps) {
            super(props);
            this.field = form.getField(props.name);
        }

        public onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
            event.preventDefault();
            this.field.set(event.target.value);
        }

        public forceUpdateWrapper = (): void => {
            this.forceUpdate();
        }

        public componentDidMount = (): void => {
            this.field.subscribe(this.forceUpdateWrapper);
        }

        public componentWillUnmount = (): void => {
            this.field.unsubscribe(this.forceUpdateWrapper);
        }

        public render = (): JSX.Element => {
            if (this.field.name !== this.props.name)
                this.field = form.getField(this.props.name);
            return <input {...this.props} value={this.field.value || ""} onChange={this.onChange} />;
        }

    }
    Object.defineProperty(Component, "name", { value: "Field" });
    Object.defineProperty(Component, "displayName", { value: "Field" });
    return Component;
}