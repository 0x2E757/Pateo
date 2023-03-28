import React from "react";
import { ISubscribable } from "../types";

export const useSubscribable = <T>(subscribable: ISubscribable<T>, initialValue: T) => {

    const [value, setValue] = React.useState<T>(initialValue);
    const tempValue = React.useRef(value);
    const mounted = React.useRef(false);

    const setTempValue = (value: any) => {
        tempValue.current = value;
    }

    React.useEffect(() => {
        subscribable.subscribe(setValue);
        return () => {
            subscribable.unsubscribe(setValue);
        };
    });

    React.useEffect(() => {
        subscribable.unsubscribe(setTempValue);
        if (tempValue.current !== value)
            setValue(tempValue.current);
    }, []);

    if (mounted.current === false) {
        subscribable.subscribe(setTempValue);
        mounted.current = true;
    }

    return value;

};