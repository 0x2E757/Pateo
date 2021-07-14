export { get, set, del } from "./object";

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

export function clone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
}