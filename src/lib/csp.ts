/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { Logger } from "@utils/logger"


// heavily based on Vencord's CSP patcher
// see that file here: TODO
type onHeadersRecievedCallback = (options: { cancel: boolean, responseHeaders: Record<string, string[]> }) => unknown

function onHeadersRecieved(
    { responseHeaders, resourceType }: {
    responseHeaders?: Record<string, string[]>,
    resourceType: string
}, cb: onHeadersRecievedCallback
) {

    if (responseHeaders) {
        if (resourceType === "mainFrame")
            editCsp(responseHeaders, "content-security-policy")
        if (resourceType === "stylesheet")
            responseHeaders["content-type"] = ["text/css"]
    }
    cb({ cancel: false, responseHeaders: responseHeaders! })
}

function editCsp(headers: Record<string, string[]>, header: string) {
    
}

export function patch() {
    const l = new Logger("CSPPatch");
    l.log("hi!");
    
}