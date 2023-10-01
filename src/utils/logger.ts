/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { PROJECT_NAME } from "./constants";

// vencord source: https://github.com/Vendicated/Vencord/blob/main/src/utils/Logger.ts

export class Logger {

    constructor(public name: string, public color: string = "white") { }

    private _log(level: "log" | "error" | "warn" | "info" | "debug", levelColor: string, args: any[], customFmt = "") {
        if (!(this.color == "NONE")) console[level](
            `%c ${PROJECT_NAME} %c %c ${this.name} ${customFmt}`,
            `background: ${levelColor}; color: black; font-weight: bold; border-radius: 5px;`,
            "",
            `background: ${this.color}; color: black; font-weight: bold; border-radius: 5px;`
            , ...args
        )
        else console[level](
            `${PROJECT_NAME}::${this.name} [${level}]`
            , ...args
        )


    }

    public log(...args: any[]) {
        this._log("log", "#a6d189", args);
    }

    public info(...args: any[]) {
        this._log("info", "#a6d189", args);
    }

    public error(...args: any[]) {
        this._log("error", "#e78284", args);
    }

    public errorCustomFmt(fmt: string, ...args: any[]) {
        this._log("error", "#e78284", args, fmt);
    }

    public warn(...args: any[]) {
        this._log("warn", "#e5c890", args);
    }

    public debug(...args: any[]) {
        this._log("debug", "#eebebe", args);
    }
}