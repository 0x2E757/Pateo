import { FlattenedObject } from "../types";
export { exists, get, set, remove } from "./object";

export function uuid(): string {
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

function flattenObjectInner(object: any, propertyName: string, result: FlattenedObject = {}) {
    if (typeof object === "object")
        flattenObject(object, propertyName, result);
    else
        result[propertyName] = object;
}

export function flattenObject(object: any, parentPropertyName?: string, result: FlattenedObject = {}) {
    if (Array.isArray(object))
        for (let index = 0; index < object.length; index += 1) {
            const propertyName = parentPropertyName ? `${parentPropertyName}[${index}]` : `[${index}]`;
            flattenObjectInner(object[index], propertyName, result);
        }
    else
        for (const key in object) {
            const propertyName = parentPropertyName ? `${parentPropertyName}.${key}` : key;
            flattenObjectInner(object[key], propertyName, result);
        }
    return result;
}

function flattenErrorsObjectInner(object: any, propertyName: string, result: FlattenedObject = {}) {
    if (typeof object === "object")
        if (Array.isArray(object) && typeof object[0] === "string")
            result[propertyName] = object;
        else
            flattenErrorsObject(object, propertyName, result);
    else
        result[propertyName] = object;
}

export function flattenErrorsObject(object: any, parentPropertyName?: string, result: FlattenedObject = {}) {
    if (Array.isArray(object))
        for (let index = 0; index < object.length; index += 1) {
            const propertyName = parentPropertyName ? `${parentPropertyName}[${index}]` : `[${index}]`;
            flattenErrorsObjectInner(object[index], propertyName, result);
        }
    else
        for (const key in object) {
            const propertyName = parentPropertyName ? `${parentPropertyName}.${key}` : key;
            flattenErrorsObjectInner(object[key], propertyName, result);
        }
    return result;
}

export function lowerCaseKeys(object: any) {
    const result: any = {};
    for (const key in object)
        result[key.toLowerCase()] = object[key];
    return result;
}