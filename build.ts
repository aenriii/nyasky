import { watch } from "fs/promises";
import esbuild, { BuildOptions } from "esbuild";
import { Logger } from "@utils/logger";

if (Bun.argv.includes("serve")) {
    let worker = new Worker(new URL("./buildSrc/serve.ts", import.meta.url));
    await build();
    worker.postMessage("stop");
} else {
    await build();
}

export default async function build() {
    const l = new Logger("Builder", "NONE");
    const buildDir = "extension/scripts";
    let defaultOptions = {
        bundle: true,
        minify: true,
        logLevel: "error",
        format: "esm",
    }
    const ctx = [await esbuild.context({
        outfile: `${buildDir}/nyasky.js`,
        entryPoints: ["src/index.ts"],
        banner: {
            js: "(async()=>{"
        },
        footer: {
            js: "})();"
        },
        ...defaultOptions
    } as BuildOptions)]
    if (Bun.argv.includes("watch")) {
        l.debug("Performing initial build...");
        await ctx.map(async c => await c.rebuild());
        l.debug("Initial build complete");
        l.debug("Watching for changes...");
        for await (let event of watch("src", { recursive: true })) {
            l.debug(`File ${event.eventType}d: ${event.filename}`);
            let stopwatch = Date.now();
            l.debug("rebuilding...");
            await ctx.map(async c => await c.rebuild());
            l.debug(`rebuild complete in ${Date.now() - stopwatch}ms`);
        }
    } else {
        l.debug("Building...");
        await ctx.map(async c => await c.rebuild());
        l.debug("Build complete");
    }
}