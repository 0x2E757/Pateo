import { Base } from "./base";
import { Form } from "./form";

export class Field extends Base {

    private form: Form;

    public value: any;

    public constructor(form: Form, name: string) {
        super(name);
        this.form = form;
        this.value = undefined;
    }

    public set = (value: any): void => {
        this.value = value;
        this.trigger(this.value);
        if (!this.form.lazy)
            this.form.setValue(this.name, this.value);
    }

}