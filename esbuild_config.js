const {build} = require("esbuild");

const args = process.argv;

const IS_DEBUG = args.indexOf("debug") != -1;
const IS_RELEASE = !IS_DEBUG;

build({
    entryPoints: ["src/index.ts"],
    outfile: "bin/game.js",
    watch: args.indexOf("watch") != -1,
    define: {
        DEBUG: String(IS_DEBUG),
        RELEASE: String(IS_RELEASE)
    },
    sourcemap: true,
    bundle: true
});