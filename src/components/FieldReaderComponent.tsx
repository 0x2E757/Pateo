import * as React from "react";
import { Extend } from "../types";
import { Form, Field } from "../forms";

type PropsBase = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

export type FieldReaderProps = {
    name: string,
    children?: (field: { value: any }) => JSX.Element,
    component?: (field: { value: any }) => JSX.Element,
};

export function getFieldReaderComponent(form: Form) {
    class FieldReaderComponent extends React.PureComponent<Extend<PropsBase, FieldReaderProps>> {

        private field: Field;

        constructor(props: Extend<PropsBase, FieldReaderProps>) {
            super(props);
            this.field = form.getField(props.name);
        }

        private fourceUpdateWrapper = (): void => {
            this.forceUpdate();
        }

        public componentDidMount = (): void => {
            this.field.subscribe(this.fourceUpdateWrapper);
        }

        public componentWillUnmount = (): void => {
            this.field.unsubscribe(this.fourceUpdateWrapper);
        }

        public render = (): JSX.Element => {
            if (this.field.name !== this.props.name) {
                this.field.unsubscribe(this.fourceUpdateWrapper);
                this.field = form.getField(this.props.name);
                this.field.subscribe(this.fourceUpdateWrapper);
            }
            const { value } = this.field;
            const component = this.props.children ?? this.props.component;
            return component!({ value });
        }

    }
    Object.defineProperty(FieldReaderComponent, "name", { value: "Field Reader" });
    Object.defineProperty(FieldReaderComponent, "displayName", { value: `(${form.name})(Field Reader)` });
    return FieldReaderComponent;
}