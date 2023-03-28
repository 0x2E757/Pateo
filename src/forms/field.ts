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
                this.inputProps.value = value;
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
            this.form.setValue(this.name, this.defaultValue);
        }
        this.visited = false;
        this.touched = false;
        this.submitFailed = false;
        this.validate();
        this.trigger();
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