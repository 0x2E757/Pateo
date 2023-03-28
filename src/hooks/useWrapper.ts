import React from "react";
import { IStaticWrapper } from "@0x2e757/wrappers";

export const useWrapper = <T>(wrapper: IStaticWrapper<T>) => {

    const [value, setValue] = React.useState<T>(wrapper.emit());
    const tempValue = React.useRef(value);
    const mounted = React.useRef(false);

    const setTempValue = (value: any) => {
        tempValue.current = value;
    }

    React.useEffect(() => {
        wrapper.subscribe(setValue);
        return () => {
            wrapper.unsubscribe(setValue);
        };
    });

    React.useEffect(() => {
        wrapper.unsubscribe(setTempValue);
        if (tempValue.current !== value)
            setValue(tempValue.current);
    }, []);

    if (mounted.current === false) {
        wrapper.subscribe(setTempValue);
        mounted.current = true;
    }

    return [value, wrapper.set] as [T, typeof wrapper.set];

};