import { Subscriber } from "../types";

export class Base<T = any> {

    public name: string;

    protected subscribers: Set<Subscriber>;

    public constructor(name: string) {
        this.name = name;
        this.subscribers = new Set();
    }

    public subscribe = (subscriber: Subscriber): void => {
        this.subscribers.add(subscriber);
    }

    public unsubscribe = (subscriber: Subscriber): void => {
        this.subscribers.delete(subscriber);
    }

    public trigger = (value: T): void => {
        for (const subscriber of this.subscribers)
            subscriber(value);
    }

}