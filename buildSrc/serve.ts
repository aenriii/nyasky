declare var self: Worker
import { Logger } from "@utils/logger";
import { existsSync } from "fs";
import { join } from "path";
let l: Logger = new Logger("BuildServerWorker", "NONE");
l.info("Starting server...");
Bun.serve({
    fetch(req) {
        const filePath = new URL(req.url).pathname;
        l.debug(`Serving ${filePath}`);
        if (existsSync(join("dist", filePath))) {
            return new Response(Bun.file(join("dist", filePath)));
        } else {
            l.debug(`${filePath} 404!`);
            return new Response(null, { status: 404 });
        }
    },

    port: 1231,
})
self.onmessage = (m) => {
    if (m.data == "stop") self.terminate();
};