enum AccessKind { None, Initial, ByDot, ByBrackets };

interface IParserData {
    value: any;
    path: string;
    partStartIndex: number;
    partEndIndex: number;
    accessKind: AccessKind;
    numbersOnly: boolean;
}

const codes = {
    dot: '.'.charCodeAt(0),
    openingBracket: '['.charCodeAt(0),
    closingBracket: ']'.charCodeAt(0),
    quotes: '"'.charCodeAt(0),
    zero: '0'.charCodeAt(0),
    nine: '9'.charCodeAt(0),
};

const cloneRoot = (value: any): any => {
    return typeof value == "object" ? Array.isArray(value) ? [...value] : { ...value } : value;
}

const getInitialData = (object: any, path: string): IParserData => {
    return {
        value: object,
        path: path,
        partStartIndex: 0,
        partEndIndex: 0,
        accessKind: AccessKind.Initial,
        numbersOnly: true,
    };
}

const updatePartBounds = (parserData: IParserData): void => {
    while (parserData.partEndIndex < parserData.path.length) {
        const charCode: number = parserData.path.charCodeAt(parserData.partEndIndex);
        switch (charCode) {
            case codes.dot:
                if (parserData.partStartIndex != parserData.partEndIndex) {
                    parserData.numbersOnly = false;
                    if (parserData.accessKind !== AccessKind.ByBrackets) {
                        parserData.partEndIndex -= 1;
                        return;
                    }
                }
                parserData.accessKind = AccessKind.ByDot;
                break;
            case codes.openingBracket:
                if (parserData.partStartIndex != parserData.partEndIndex) {
                    parserData.numbersOnly = false;
                    parserData.partEndIndex -= 1;
                    return;
                }
                parserData.accessKind = AccessKind.ByBrackets;
                break;
            case codes.closingBracket:
                return;
            default:
                if (charCode < codes.zero || charCode > codes.nine)
                    parserData.numbersOnly = false;
        }
        parserData.partEndIndex += 1;
    }
}

const parsePart = (parserData: IParserData): string => {
    switch (parserData.accessKind) {
        case AccessKind.None:
            throw new Error(`Parse error, ensure path is valid.\r\nPath: ${parserData.path}`);
        case AccessKind.Initial:
            return parserData.path.substring(parserData.partStartIndex, parserData.partEndIndex + 1);
        case AccessKind.ByDot:
            return parserData.path.substring(parserData.partStartIndex + 1, parserData.partEndIndex + 1);
        case AccessKind.ByBrackets:
            return parserData.path.substring(parserData.partStartIndex + 1, parserData.partEndIndex);
    }
}

export const get = (object: any, path: string, throwOnFail: boolean = false): unknown => {
    if (typeof object != "object")
        throw new Error(`First argument value must be an object.`);
    const parserData: IParserData = getInitialData(object, path);
    while (parserData.partEndIndex < path.length) {
        if (parserData.value === null || parserData.value === undefined) {
            if (throwOnFail)
                throw new Error(`Parse error, property does not exist, is undefined or null.\r\nPath: ${path.substring(0, parserData.partStartIndex)}\r\nFull: ${path}`);
            else
                return undefined;
        }
        updatePartBounds(parserData);
        const part: string = parsePart(parserData);
        const key: string | number = parserData.numbersOnly && part.length ? Number(part) : part;
        parserData.value = parserData.value[key];
        parserData.partStartIndex = parserData.partEndIndex + 1;
        parserData.partEndIndex = parserData.partStartIndex;
        parserData.accessKind = AccessKind.None;
        parserData.numbersOnly = true;
    }
    return parserData.value;
}

export const set = (object: any, path: string, value: any, immutable: boolean = false): any => {
    if (typeof object != "object")
        throw new Error(`First argument value must be an object.`);
    const parserData: IParserData = getInitialData(object, path);
    const result: any = immutable ? parserData.value = cloneRoot(object) : object;
    while (parserData.partEndIndex < path.length) {
        updatePartBounds(parserData);
        const part: string = parsePart(parserData);
        const key: string | number = parserData.numbersOnly && part.length ? Number(part) : part;
        if (parserData.partEndIndex == (parserData.accessKind == AccessKind.ByBrackets ? path.length - 1 : path.length)) {
            parserData.value[key] = value;
            break;
        } else {
            if (parserData.value[key] === null || parserData.value[key] === undefined) {
                parserData.value = parserData.value[key] = parserData.accessKind == AccessKind.ByBrackets && parserData.numbersOnly ? [] : {};
            } else
                if (typeof parserData.value[key] != "object")
                    throw new Error(`Set error, property exist but is not an object.\r\nPath: ${path.substring(0, parserData.partEndIndex + 1)}\r\nFull: ${path}`);
                else
                    parserData.value = immutable ? parserData.value[key] = cloneRoot(parserData.value[key]) : parserData.value[key];
            parserData.partStartIndex = parserData.partEndIndex + 1;
            parserData.partEndIndex = parserData.partStartIndex;
            parserData.accessKind = AccessKind.None;
            parserData.numbersOnly = true;
        }
    }
    return result;
}

export const del = (object: any, path: string): any => {
    if (typeof object != "object")
        throw new Error(`First argument value must be an object.`);
    const parserData: IParserData = getInitialData(object, path);
    while (parserData.partEndIndex < path.length) {
        if (parserData.value === null || parserData.value === undefined)
            break;
        updatePartBounds(parserData);
        const part: string = parsePart(parserData);
        const key: string | number = parserData.numbersOnly && part.length ? Number(part) : part;
        if (parserData.partEndIndex == (parserData.accessKind == AccessKind.ByBrackets ? path.length - 1 : path.length)) {
            const result: any = parserData.value[key];
            delete parserData.value[key];
            return result;
        } else {
            parserData.value = parserData.value[key];
            parserData.partStartIndex = parserData.partEndIndex + 1;
            parserData.partEndIndex = parserData.partStartIndex;
            parserData.accessKind = AccessKind.None;
            parserData.numbersOnly = true;
        }
    }
    return undefined;
}