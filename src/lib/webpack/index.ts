/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

declare var window: Window & {
    webpackRequire: WebpackRequire,
    webpackCache: WebpackRequire["m"]
} & { [key: string]: unknown }

export type Webpack = {
    0: Symbol[],
    1: unknown,
    2: <T>(r: WebpackRequire) => T
}[] & {
    push<T>(chunk: [Symbol[], unknown, (r: WebpackRequire) => T]): T
}
export type WebpackRequire = (<T>(id: number) => { default: T }) & {
    m: WebpackCache
}
export type WebpackCache = { [key: number]: { default: unknown } }

export * from "./patch"
