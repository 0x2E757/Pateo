import * as utils from "../utils";
import * as components from "../components";
import { DeepPartial, DeepReadonlyPartial, Subscriber } from "../types";
import { Field } from "./field";

export class Form<T = {}> {

    public readonly name: string;
    public readonly Form: ReturnType<typeof components.getFormComponent>;
    public readonly Submit: ReturnType<typeof components.getSubmitComponent>;
    public readonly Reset: ReturnType<typeof components.getResetComponent>;
    public readonly Field: ReturnType<typeof components.getFieldComponent>;
    public readonly Input: ReturnType<typeof components.getInputComponent>;
    public readonly FieldArray: ReturnType<typeof components.getFieldArrayComponent>;
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
        this.FieldArray = components.getFieldArrayComponent(this);
        this.FieldReader = components.getFieldReaderComponent(this);
        this.onSubmit = undefined;
        this.values = {};
        this.fields = new Map();
        this.subscribers = new Set();
    }

    public getKeys = (): IterableIterator<string> => {
        return this.fields.keys();
    }

    public valueExists = (path: string): boolean => {
        const pathLowerCase = path.toLowerCase();
        return utils.exists(this.values, pathLowerCase);
    }

    public getValue = (path: string): any => {
        const pathLowerCase = path.toLowerCase();
        return utils.get(this.values, pathLowerCase);
    }

    public setValue = (path: string, value: any): void => {
        const pathLowerCase = path.toLowerCase();
        if (value !== undefined && value !== "")
            utils.set(this.values, pathLowerCase, value);
        else
            utils.remove(this.values, pathLowerCase);
        this.trigger();
    }

    private initializeArraysInner = (object: any, propertyName: string) => {
        if (typeof object === "object") {
            if (Array.isArray(object)) {
                const field = this.getField(propertyName);
                if (field.value === undefined) {
                    field.value = object;
                    field.inputProps.value = object ?? "";
                    field.validate();
                    field.trigger();
                }
            }
            this.initializeArrays(object, propertyName);
        }
    }

    private initializeArrays = (object: any, parentPropertyName: string = "") => {
        if (Array.isArray(object)) {
            for (let index = 0; index < object.length; index += 1) {
                const propertyName = parentPropertyName ? `${parentPropertyName}[${index}]` : `[${index}]`;
                this.initializeArraysInner(object[index], propertyName);
            }
        } else {
            for (const key in object) {
                const propertyName = parentPropertyName ? `${parentPropertyName}.${key}` : key;
                this.initializeArraysInner(object[key], propertyName);
            }
        }
    }

    public setValues = (values: any): void => {
        const normalizedValues = utils.lowerCaseKeys(utils.flattenObject(values));
        for (const key in normalizedValues) {
            const field = this.getField(key);
            const value = normalizedValues[key];
            utils.set(this.values, key, value);
            field.value = value;
            field.inputProps.value = value ?? "";
            field.validate();
            field.trigger();
        }
        this.initializeArrays(this.values);
        this.trigger();
    }

    public setSubmissionErrors = (errors: Object): void => {
        const normalizedErrors = utils.lowerCaseKeys(utils.flattenErrorsObject(errors));
        const keys = this.getKeys();
        for (const key of keys) {
            if (key in normalizedErrors) {
                const fieldErrors = typeof normalizedErrors[key] == "string" ? [normalizedErrors[key] as string] : normalizedErrors[key] as string[];
                this.getField(key.toLowerCase()).setSubmissionErrors(fieldErrors);
            } else {
                const field = this.fields.get(key)!;
                field.submitFailed = field.validate() === false;
                field.trigger();
            }
        }
    }

    public getField = (name: string): Field => {
        const nameLowerCase = name.toLowerCase();
        let field: Field | undefined = this.fields.get(nameLowerCase);
        if (field === undefined) {
            field = new Field(this, nameLowerCase, this.getValue(nameLowerCase));
            this.fields.set(nameLowerCase, field);
        }
        return field;
    }

    public removeField = (name: string): boolean => {
        const nameLowerCase = name.toLowerCase();
        return this.fields.delete(nameLowerCase);
    }

    public getValues = (): DeepReadonlyPartial<T> => {
        return { ...this.values };
    }

    public reset = (): void => {
        const keys = this.getKeys();
        for (const key of keys)
            this.fields.get(key)!.reset();
    }

    private checkCanSubmit = (): boolean => {
        let allValid = true;
        const keys = this.getKeys();
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
            subscriber(this.getValues());
    }

}