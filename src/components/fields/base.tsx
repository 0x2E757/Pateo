import * as React from "react";
import { Extend } from "../../types";
import { Form } from "../../form";
import { Field } from "../../field";

export interface IFieldProps {
    name: string;
}

export function getBaseComponent<P, S = {}>(form: Form) {
    class BaseComponent extends React.PureComponent<Extend<P, IFieldProps>, S> {
        
        protected field: Field;

        constructor(props: Extend<P, IFieldProps>) {
            super(props);
            this.field = form.getField(props.name);
        }

        private fourceUpdateWrapper = (): void => {
            this.forceUpdate();
        }

        protected updateField = (): void => {
            if (this.field.name !== this.props.name) {
                this.field.unsubscribe(this.fourceUpdateWrapper);
                this.field = form.getField(this.props.name);
                this.field.subscribe(this.fourceUpdateWrapper);
            }
        }

        public componentDidMount = (): void => {
            this.field.subscribe(this.fourceUpdateWrapper);
        }

        public componentWillUnmount = (): void => {
            this.field.unsubscribe(this.fourceUpdateWrapper);
        }

    }
    Object.defineProperty(BaseComponent, "name", { value: "Field Base" });
    Object.defineProperty(BaseComponent, "displayName", { value: `(${form.name})(Field Base)` });
    return BaseComponent;
}