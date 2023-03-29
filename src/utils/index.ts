import { ValidationErrors } from "../types";
export { exists, get, set, remove } from "./object";

export const uuid = (): string => {
    // https://stackoverflow.com/a/873856
    const result: string[] = new Array(36);
    const hexDigits: string = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        result[i] = hexDigits[Math.floor(Math.random() * 0x10)];
    }
    result[14] = "4";
    result[19] = hexDigits[(Number(result[19]) & 0x3) | 0x8];
    result[8] = result[13] = result[18] = result[23] = "-";
    return result.join("");
}

export const flattenObject = (object: any, parentPropertyName?: string, result: ValidationErrors = {}) => {
    for (const key in object) {
        const propertyName = parentPropertyName ? parentPropertyName + "." + key : key;
        if (typeof object[key] === "object")
            if (Array.isArray(object[key]) && typeof object[key][0] === "string")
                result[propertyName] = object[key];
            else
                flattenObject(object[key], propertyName, result);
        else
            result[propertyName] = object[key];
    }
    return result;
}

export const lowerCaseKeys = (object: any) => {
    const result: any = {};
    for (const key in object)
        result[key.toLowerCase()] = object[key];
    return result;
}