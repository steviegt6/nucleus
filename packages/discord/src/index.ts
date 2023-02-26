import * as nucleusConstants from "./utils/nucleusConstants";

const { join } = require("path");

global.log = (area, ...args) => console.log(`[\x1b[38;2;88;101;242mnucleus\x1b[0m > ${area}]`, ...args);
global.oaVersion = "nightly";

log("Init", "nucleus", oaVersion);

// log("Copyright", nucleusConstants.LICENSE_TEXT);

if (process.resourcesPath.startsWith("/usr/lib/electron")) global.systemElectron = true; // Using system electron, flag for other places
// @ts-ignore
// TODO: figure out a way to make this not readonly so we can have actual type checking
process.resourcesPath = join(__dirname, ".."); // Force resourcesPath for system electron

const paths = require("./paths");
paths.init();

global.settings = require("./appSettings").getSettings();
global.oaConfig = settings.get("openasar", {});

// Inject mods right after resolving settings.
import addonHandler from "./addons/addonHandler";
addonHandler();

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
