import * as utils from "../utils";
import { DeepPartial, DeepReadonlyPartial } from "../types";
import { Base } from "./base";
import { Field } from "./field";

export class Form<T = any> extends Base {

    public lazy: boolean;
    public mutable: boolean;
    public values: DeepPartial<T>;

    private fields: Map<string, Field>;

    public constructor(name?: string) {
        super(name ?? utils.uuid());
        this.lazy = true;
        this.mutable = true;
        this.values = {};
        this.fields = new Map();
    }

    public setValue = (name: string, value: any): void => {
        this.values = utils.set(this.values, name, value, !this.mutable);
        this.trigger(this.values);
    }

    public getField = (name: string): Field => {
        let field: Field | undefined = this.fields.get(name);
        if (field === undefined) {
            field = new Field(this, name);
            this.fields.set(name, field);
        }
        return field;
    }

    public deleteField = (name: string): boolean => {
        return this.fields.delete(name);
    }

    public submit = (callback: (values: DeepReadonlyPartial<T>) => void): void => {
        if (this.lazy) {
            for (const [name, field] of this.fields)
                this.values = utils.set(this.values, name, field.value, !this.mutable);
            this.trigger(this.values);
        }
        callback(this.values);
    }

}