import * as utils from "./utils";
import * as components from "./components";
import { DeepPartial, DeepReadonlyPartial, Subscriber } from "./types";
import { Field } from "./field";

export class Form<T = {}> {

    public readonly name: string;
    public readonly Form: ReturnType<typeof components.getFormComponent>;
    public readonly Submit: ReturnType<typeof components.getSubmitComponent>;
    public readonly Reset: ReturnType<typeof components.getResetComponent>;
    public readonly Field: ReturnType<typeof components.getFieldComponent>;
    public readonly Input: ReturnType<typeof components.getInputComponent>;
    public readonly FieldReader: ReturnType<typeof components.getFieldReaderComponent>;

    public onSubmit?: (values: DeepReadonlyPartial<T>) => void;

    private values: DeepPartial<T>;
    private fields: Map<string, Field>;
    private subscribers: Set<Subscriber<DeepPartial<T>>>;

    public constructor(name?: string) {
        this.name = name ?? utils.uuid();
        this.Form = components.getFormComponent(this);
        this.Submit = components.getSubmitComponent(this);
        this.Reset = components.getResetComponent(this);
        this.Field = components.getFieldComponent(this);
        this.Input = components.getInputComponent(this);
        this.FieldReader = components.getFieldReaderComponent(this);
        this.onSubmit = undefined;
        this.values = {};
        this.fields = new Map();
        this.subscribers = new Set();
    }

    public setValue = (path: string, value: any): void => {
        if (value !== undefined && value !== "")
            utils.set(this.values, path, value);
        else
            utils.del(this.values, path);
        this.trigger();
    }

    public setSubmissionErrors = (errors: Object): void => {
        const flattenedErrors = utils.flattenObject(errors);
        for (const fieldName in flattenedErrors) {
            const fieldErrors = typeof flattenedErrors[fieldName] == "string" ? [flattenedErrors[fieldName] as string] : flattenedErrors[fieldName] as string[];
            this.getField(fieldName).setSubmissionErrors(fieldErrors);
        }
    }

    public getField = (name: string): Field => {
        let field: Field | undefined = this.fields.get(name);
        if (field === undefined) {
            field = new Field(this, name);
            this.fields.set(name, field);
        }
        return field;
    }

    public reset = (): void => {
        const keys = this.fields.keys();
        for (const key of keys)
            this.fields.get(key)!.reset();
    }

    private checkCanSubmit = (): boolean => {
        let allValid = true;
        const keys = this.fields.keys();
        for (const key of keys) {
            const field = this.fields.get(key)!;
            field.submitFailed = field.validate() === false;
            if (field.submitFailed) {
                field.trigger();
                allValid = false;
            }
        }
        return allValid;
    }

    public submit = (callback?: (values: DeepReadonlyPartial<T>) => void): void => {
        if (this.checkCanSubmit()) {
            if (callback)
                callback(this.values);
            else if (this.onSubmit)
                this.onSubmit(this.values);
            else
                console.warn(`Unhandled submit of ${this.name}`, this.values);
        }
    }

    public subscribe = (subscriber: Subscriber<DeepPartial<T>>): void => {
        this.subscribers.add(subscriber);
    }

    public unsubscribe = (subscriber: Subscriber<DeepPartial<T>>): void => {
        this.subscribers.delete(subscriber);
    }

    public trigger = (): void => {
        for (const subscriber of this.subscribers)
            subscriber(this.values);
    }

}