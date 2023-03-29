import { useEffect, useRef, useState } from "react";
import { ISubscribable } from "../types";

export function useSubscribable<T>(subscribable: ISubscribable<T>, initialValue: T) {

    const [value, setValue] = useState<T>(initialValue);
    const tempValue = useRef(value);
    const flag = useRef(false);

    const setTempValue = (value: any) => {
        tempValue.current = value;
    }

    useEffect(() => {
        subscribable.subscribe(setValue);
        return () => {
            subscribable.unsubscribe(setValue);
        };
    });

    useEffect(() => {
        subscribable.unsubscribe(setTempValue);
        if (tempValue.current !== value)
            setValue(tempValue.current);
    }, []);

    if (flag.current === false) {
        subscribable.subscribe(setTempValue);
        flag.current = true;
    }

    return value;

}