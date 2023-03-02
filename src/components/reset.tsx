import * as React from "react";
import { Form } from "../form";

type ResetPropsBase = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export function getResetComponent(form: Form) {
    class ResetComponent extends React.PureComponent<ResetPropsBase> {

        private onClick = (event: React.MouseEvent<HTMLInputElement>): void => {
            event.preventDefault();
            form.reset();
        }

        public render = (): JSX.Element => {
            return <input value="Reset" {...this.props} type="button" onClick={this.onClick} />;
        }

    }
    Object.defineProperty(ResetComponent, "name", { value: "Reset" });
    Object.defineProperty(ResetComponent, "displayName", { value: `(${form.name})(Reset)` });
    return ResetComponent;
}