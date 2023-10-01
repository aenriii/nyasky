/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import { WEBPACK_NAME } from "@utils/constants";
import { Webpack, WebpackCache, WebpackRequire } from ".";
import { Logger } from "@utils/logger";

declare var window: Window & {
    webpackRequire: WebpackRequire,
    webpackCache: WebpackRequire["m"]
} & { [key: string]: unknown }

export let webpackRequire: WebpackRequire;

export let webpackCache: WebpackCache;

let webpackChunk: Webpack;

const l: Logger = new Logger("WebpackPatch");

export async function patchWebpack() {
    webpackChunk= window[WEBPACK_NAME] as Webpack
    if (webpackRequire != void 0) {
        l.error("Webpack already patched!");
        return;
    } // nuh uh!
    if (webpackChunk) {
        l.info("Patching webpack...");
        webpackRequire = webpackChunk.push([[Symbol("nyasky")], {}, r => r]);
        webpackCache = webpackRequire.m;
        window.webpackRequire = webpackRequire;
        window.webpackCache = webpackCache;
        webpackChunk.pop();
        l.info("Patched webpack!");

    }
}
