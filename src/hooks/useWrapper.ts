import { useEffect, useRef, useState } from "react";
import { IWrapper, IStaticWrapper } from "@0x2e757/wrappers";

export function useWrapper<T>(wrapper: IWrapper<T>) {

    const [value, setValue] = useState<T>(wrapper.emit());
    const tempValue = useRef(value);
    const flag = useRef(false);

    const setTempValue = (value: any) => {
        tempValue.current = value;
    }

    useEffect(() => {
        wrapper.subscribe(setValue);
        return () => {
            wrapper.unsubscribe(setValue);
        };
    });

    useEffect(() => {
        wrapper.unsubscribe(setTempValue);
        if (tempValue.current !== value)
            setValue(tempValue.current);
    }, []);

    if (flag.current === false) {
        wrapper.subscribe(setTempValue);
        flag.current = true;
    }

    return [value, (wrapper as IStaticWrapper<T>).set] as [T, (value: T, debounce?: number) => void];

}