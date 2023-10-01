import { Webpack, patchWebpack } from "@lib/webpack";
import moduleStore from "@lib/webpack/module-store";
import { WEBPACK_NAME } from "@utils/constants";
import { Logger } from "@utils/logger";

declare var window: Window & { [key: string]: unknown }

const l = new Logger("Entry");
l.log("Hello world!");

document.addEventListener("DOMContentLoaded", async () => {
    if (!window[WEBPACK_NAME]) { // @ts-ignore
        l.log("Waiting for webpack to load...");
        while (!window[WEBPACK_NAME]) {
            l.debug("Waiting for webpack to load...");
            await new Promise(r => setTimeout(r, 100));
        }
    }
    l.log("Webpack loaded!")
    await patchWebpack();
    let react = moduleStore.findAllByCode(/react/i);
    if (react.length == 0) {
        l.error("React not found!");
        return;
    }
    l.log("React found!")

})