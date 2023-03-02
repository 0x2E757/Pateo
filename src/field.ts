import { Subscriber } from "./types";
import { Form } from "./form";

export class Field {

    private readonly form: Form;

    public readonly name: string;

    public initialValue: any;
    public defaultValue: any;
    public value: any;

    private subscribers: Set<Subscriber>;

    public constructor(form: Form, name: string) {
        this.form = form;
        this.name = name;
        this.initialValue = undefined;
        this.defaultValue = undefined;
        this.value = undefined;
        this.subscribers = new Set();
    }

    public setInitialValue = (value: any): void => {
        if (this.initialValue !== value && value !== undefined) {
            this.initialValue = value;
            if (this.value === undefined)
                this.change(value);
        }
    }

    public setDefaultValue = (value: any): void => {
        if (this.defaultValue !== value && value !== undefined) {
            this.defaultValue = value;
            if (this.initialValue === undefined)
                this.setInitialValue(value);
        }
    }

    public change = (value: any): void => {
        this.form.setValue(this.name, this.value = value);
        this.trigger();
    }

    public reset = (): void => {
        if (this.value !== this.defaultValue)
            this.change(this.defaultValue);
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