import * as React from "react";
import { Extend } from "../types";
import { Form } from "../form";
import { Field } from "../field";

type PropsBase = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

interface IFieldReaderProps {
    name: string;
    children?: (field: { value: any }) => JSX.Element;
    component?: (field: { value: any }) => JSX.Element;
}

export function getFieldReaderComponent(form: Form) {
    class FieldReader extends React.PureComponent<Extend<PropsBase, IFieldReaderProps>> {

        private field: Field;

        constructor(props: Extend<PropsBase, IFieldReaderProps>) {
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
    Object.defineProperty(FieldReader, "name", { value: "Field Reader" });
    Object.defineProperty(FieldReader, "displayName", { value: `(${form.name}) Field Reader` });
    return FieldReader;
}