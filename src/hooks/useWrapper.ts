import { useEffect, useRef, useState } from "react";
import { IStaticWrapper } from "@0x2e757/wrappers";

export const useWrapper = <T>(wrapper: IStaticWrapper<T>) => {

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

    return [value, wrapper.set] as [T, typeof wrapper.set];

};