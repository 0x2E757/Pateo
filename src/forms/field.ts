import { Validator, Subscriber } from "../types";
import { Form } from "./form";

type InputProps = {
    name: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onFocus: (event: React.FocusEvent<HTMLInputElement>) => void,
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
    value: any,
}

export class Field {

    public readonly form: Form;
    public readonly name: string;

    public validators: Validator[];
    public errors: string[];

    public initialValue: any;
    public defaultValue: any;
    public value: any;

    public active: boolean;
    public visited: boolean;
    public touched: boolean;
    public submitFailed: boolean;

    public inputProps: InputProps;

    private subscribers: Set<Subscriber>;

    public constructor(form: Form, name: string) {

        this.form = form;
        this.name = name;

        this.validators = [];
        this.errors = [];

        this.initialValue = undefined;
        this.defaultValue = undefined;
        this.value = undefined;

        this.active = false;
        this.visited = false;
        this.touched = false;
        this.submitFailed = false;

        this.inputProps = {
            name: name,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => this.change(event.target.value),
            onFocus: () => this.focus(),
            onBlur: () => this.blur(),
            value: "",
        }

        this.subscribers = new Set();

    }

    public setValidators = (validators: Validator[]): void => {
        if (this.validators[0] !== validators[0]) {
            this.validators = validators;
            this.validate();
        }
    }

    public setSubmissionErrors = (errors: string[]): void => {
        this.errors = errors;
        this.submitFailed = true;
        this.trigger();
    }

    public setInitialValue = (value: any): void => {
        if (this.initialValue !== value && value !== undefined) {
            this.initialValue = value;
            if (this.value === undefined) {
                this.value = value;
                this.inputProps.value = value ?? "";
                this.form.setValue(this.name, value);
                this.validate();
                this.trigger();
            }
        }
    }

    public setDefaultValue = (value: any): void => {
        if (this.defaultValue !== value && value !== undefined) {
            this.defaultValue = value;
            if (this.initialValue === undefined)
                this.setInitialValue(value);
        }
    }

    public validate = (): boolean => {
        const errors = [];
        for (const validator of this.validators) {
            const result = validator(this.value);
            if (result !== undefined)
                errors.push(result);
        }
        this.errors = errors;
        return errors.length === 0;
    }

    public focus = (): void => {
        this.active = true;
        this.visited = true;
        this.trigger();
    }

    public change = (value: any): void => {
        this.value = value;
        this.inputProps.value = value ?? "";
        this.form.setValue(this.name, value);
        this.validate();
        this.trigger();
    }

    public blur = (): void => {
        this.active = false;
        this.touched = this.visited;
        this.trigger();
    }

    public reset = (): void => {
        if (this.value !== this.defaultValue) {
            this.value = this.defaultValue;
            this.inputProps.value = this.defaultValue ?? "";
            if (this.form.valueExists(this.name))
                this.form.setValue(this.name, this.defaultValue);
        }
        this.visited = false;
        this.touched = false;
        this.submitFailed = false;
        this.validate();
        this.trigger();
    }

    public push = (value: any = null): void => {
        this.change([...(this.value ?? []), value]);
    }

    private getKeysListsFlags = () => {
        const keys = this.form.getKeys();
        const keysList: any = [];
        const keysFlags: any = {};
        for (const key of keys)
            if (key.startsWith(this.name + "[")) {
                keysList.push(key);
                keysFlags[key] = false;
            }
        return [keysList, keysFlags];
    }

    private import = (field: Field): void => {
        this.validators = field.validators;
        this.errors = field.errors;
        this.initialValue = field.initialValue;
        this.defaultValue = field.defaultValue;
        this.value = field.value;
        this.active = field.active;
        this.visited = field.visited;
        this.touched = field.touched;
        this.submitFailed = field.submitFailed;
        this.inputProps = {
            ...this.inputProps,
            value: field.value ?? "",
        };
        this.trigger();
    }

    public remove = (index: number): void => {
        const [keysList, keysFlags] = this.getKeysListsFlags();
        for (let n = index; n < this.value.length; n += 1) {
            if (n < this.value.length - 1)
                for (const key of keysList) {
                    const prefix = `${this.name}[${n + 1}]`;
                    if (key.startsWith(prefix)) {
                        const name = key.substring(prefix.length);
                        const keyTarget = `${this.name}[${n}]${name}`;
                        this.form.getField(keyTarget).import(this.form.getField(key));
                        keysFlags[keyTarget] = true;
                    }
                }
            for (const key of keysList) {
                const prefix = `${this.name}[${n}]`;
                if (key.startsWith(prefix))
                    if (keysFlags[key] === false)
                        this.form.removeField(key);
            }
        }
        this.value.splice(index, 1);
        this.change(this.value.length > 0 ? this.value : undefined);
    }

    public subscribe = (subscriber: Subscriber): void => {
        this.subscribers.add(subscriber);
    }

    public unsubscribe = (subscriber: Subscriber): void => {
        this.subscribers.delete(subscriber);
    }

    public trigger = (): void => {
        for (const subscriber of this.subscribers)
            subscriber(this.value);
    }

}