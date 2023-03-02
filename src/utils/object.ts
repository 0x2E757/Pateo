enum AccessKind { Object, Array };

interface Path {
    accessKind: AccessKind;
    name?: string;
    index?: string | number;
    next?: Path;
}

const codes = {
    dot: '.'.charCodeAt(0),
    openingBracket: '['.charCodeAt(0),
    closingBracket: ']'.charCodeAt(0),
    zero: '0'.charCodeAt(0),
    nine: '9'.charCodeAt(0),
};

const stringToPathObject = (string: string): Path => {
    let path!: Path;
    let numbersOnly: boolean;
    let startIndex: number = string.length;
    let currentIndex: number = startIndex;
    while (currentIndex >= 0) {
        const charCode: number = string.charCodeAt(currentIndex);
        switch (charCode) {
            case codes.dot: {
                const accessKind = AccessKind.Object;
                const name = string.substring(currentIndex + 1, startIndex);
                path = { accessKind, name, next: path };
                startIndex = currentIndex;
                break;
            }
            case codes.openingBracket: {
                const accessKind = numbersOnly! ? AccessKind.Array : AccessKind.Object;
                const index = string.substring(currentIndex + 1, startIndex - 1);
                path = { accessKind, index: numbersOnly! ? Number(index) : index, next: path };
                startIndex = currentIndex;
                break;
            }
            case codes.closingBracket: {
                numbersOnly = true;
                break;
            }
            default: {
                if (charCode < codes.zero || charCode > codes.nine)
                    numbersOnly = false;
                break;
            }
        }
        currentIndex -= 1;
    }
    if (startIndex > 0) {
        const accessKind = AccessKind.Object;
        const name = string.substring(0, startIndex);
        path = { accessKind, name, next: path };
    }
    return path;
}

const getInner = (object: any, path: Path): any => {
    const propertyName = path.accessKind === AccessKind.Object ? path.name! : path.index!;
    if (path.next !== undefined) {
        if (object[propertyName] === undefined)
            return undefined;
        return getInner(object[propertyName], path.next);
    } else {
        return object[propertyName];
    }
}

export const get = (object: any, path: string): any => {
    let pathObject = stringToPathObject(path);
    return getInner(object, pathObject);
}

const setInner = (object: any, path: Path, value: any): void => {
    const propertyName = path.accessKind === AccessKind.Object ? path.name! : path.index!;
    if (path.next !== undefined) {
        const propertyValue = object[propertyName] ?? (path.next.accessKind === AccessKind.Array ? [] : {});
        setInner(object[propertyName] = propertyValue, path.next, value);
    } else {
        object[propertyName] = value;
    }
}

export const set = (object: any, path: string, value: any): void => {
    setInner(object, stringToPathObject(path), value);
}

function delProperty(path: Path, object: any, propertyName: string | number) {
    if (path.accessKind !== AccessKind.Array)
        delete object[propertyName];
}

const delInner = (object: any, path: Path): void => {
    const propertyName = path.accessKind === AccessKind.Object ? path.name! : path.index!;
    if (path.next !== undefined) {
        const propertyValue = object[propertyName] ?? (path.next.accessKind === AccessKind.Array ? [] : {});
        delInner(object[propertyName] = propertyValue, path.next);
        if ((path.next.accessKind === AccessKind.Array ? object[propertyName] : Object.keys(object[propertyName])).length == 0)
            delProperty(path, object, propertyName);
    } else {
        delProperty(path, object, propertyName);
    }
}

export const del = (object: any, path: string): void => {
    let pathObject = stringToPathObject(path);
    delInner(object, pathObject);
}