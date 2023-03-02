import { Subscriber } from "./types";
import { Form } from "./form";

export class Field {

    private readonly form: Form;

    public readonly name: string;

    public value: any;

    private subscribers: Set<Subscriber>;

    public constructor(form: Form, name: string) {
        this.form = form;
        this.name = name;
        this.value = undefined;
        this.subscribers = new Set();
    }

    public change = (value: any): void => {
        this.form.setValue(this.name, this.value = value);
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