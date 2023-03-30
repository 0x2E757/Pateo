import * as React from "react";
import { Extend } from "../types";
import { Form, Field } from "../forms";

type PropsBase = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

type ChildrenProps = {
    names: string[],
    push: (value?: any) => void,
    remove: (index: number) => void,
};

export type FieldArrayProps = {
    name: string,
    children?: (props: ChildrenProps) => JSX.Element,
    component?: (props: ChildrenProps) => JSX.Element,
};

export function getFieldArrayComponent(form: Form) {
    class FieldArrayComponent extends React.PureComponent<Extend<PropsBase, FieldArrayProps>> {

        private field: Field;

        constructor(props: Extend<PropsBase, FieldArrayProps>) {
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
            const { push, remove } = this.field;
            const names = (this.field.value ?? []).map((item: any, index: number) => `${this.field.name}[${index}]`);
            const component = this.props.children ?? this.props.component;
            return component!({ names, push, remove });
        }

    }
    Object.defineProperty(FieldArrayComponent, "name", { value: "Field Array" });
    Object.defineProperty(FieldArrayComponent, "displayName", { value: `(${form.name})(Field Array)` });
    return FieldArrayComponent;
}