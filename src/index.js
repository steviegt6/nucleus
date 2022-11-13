const { join } = require("path");

global.log = (area, ...args) => console.log(`[\x1b[38;2;88;101;242mnucleus\x1b[0m > ${area}]`, ...args); // Make log global for easy usage everywhere

global.oaVersion = "nightly";

log("Init", "nucleus", oaVersion);

if (process.resourcesPath.startsWith("/usr/lib/electron")) global.systemElectron = true; // Using system electron, flag for other places
process.resourcesPath = join(__dirname, ".."); // Force resourcesPath for system electron

const paths = require("./paths");
paths.init();

global.settings = require("./appSettings").getSettings();
global.oaConfig = settings.get("openasar", {});

// Inject mods right after resolving settings.
require("./mods/modInjector")();

try {
    global.vibe = require("./vibe.node");
    global.oaConfig.supportsAcrylic = true;
} catch (e) {
    global.vibe = [];
    global.oaConfig.supportsAcrylic = false;
}

if (global.oaConfig.supportsAcrylic !== true || process.platform !== "win32" || (global.oaConfig.acrylicWindow !== true && !process.argv?.includes?.("--acrylic-window"))) {
    global.vibe.enabled = false;
} else {
    global.vibe.enabled = true;
    vibe.setup(require("electron").app);
}

require("./cmdSwitches")();

// Force u2QuickLoad (pre-"minified" ish)
const M = require("module"); // Module

const b = join(paths.getExeDir(), "modules"); // Base dir
if (process.platform === "win32")
    try {
        for (const m of require("fs").readdirSync(b)) M.globalPaths.push(join(b, m)); // For each module dir, add to globalPaths
    } catch {
        log("Init", "Failed to QS globalPaths");
    }

if (process.argv.includes("--overlay-host")) {
    // If overlay
    require("./utils/requireNative")("discord_overlay2", "standalone_host.js"); // Start overlay
} else {
    require("./bootstrap")(); // Start bootstrap
}
