
// this is ripped a lot from vencord
// see: https://github.com/Vendicated/Vencord/blob/main/src/utils/lazy.ts

const lCACHE = Symbol.for("nyasky.lazy.cache")
const lGET = Symbol.for("nyasky.lazy.get")

const genericHandler: ProxyHandler<any> = {};

for ( const method of [
    "apply",
    "construct",
    "defineProperty",
    "deleteProperty",
    "get",
    "getOwnPropertyDescriptor",
    "getPrototypeOf",
    "has",
    "isExtensible",
    "ownKeys",
    "preventExtensions",
    "set",
    "setPrototypeOf"
]) {
    // @ts-ignore
    genericHandler[method] = (t: any, ...args: any[]) => Reflect[method](t[lGET](), ...args) // this is fine dont worry
}
const unconfigurable = ["arguments", "caller", "prototype"];
genericHandler.ownKeys = target => {
    const v = target[lGET]();
    const keys = Reflect.ownKeys(v);
    for (const key of unconfigurable) {
        if (!keys.includes(key)) keys.push(key);
    }
    return keys;
};

genericHandler.getOwnPropertyDescriptor = (target, p) => {
    if (typeof p === "string" && unconfigurable.includes(p))
        return Reflect.getOwnPropertyDescriptor(target, p);

    const descriptor = Reflect.getOwnPropertyDescriptor(target[lGET](), p);

    if (descriptor) Object.defineProperty(target, p, descriptor);
    return descriptor;
};


function lazy<T>(fn: () => T): T {

    const pdummy = Object.assign(function () {}, {
        [lCACHE]: void 0 as T,
        [lGET]: function () {
            if (this[lCACHE] == void 0) {
                this[lCACHE] = fn()
            }
            return this[lCACHE]
        }
    })
    return new Proxy(pdummy, genericHandler) as any
}