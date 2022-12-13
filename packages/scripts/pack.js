// asar pack dist app.asar

const { execSync } = require("child_process");
const { copyFileSync, mkdirSync, existsSync } = require("fs");
const { join } = require("path");

const INCLUDE_VIBE = process.argv.indexOf("--include-vibe") !== -1;

function copyFile(name) {
    copyFileSync(join("packages", "discord", "src", name), join("dist", "discord", name));
}

console.log("Copying over files before packing into .asar...   INCLUDE_VIBE: " + INCLUDE_VIBE);

if (INCLUDE_VIBE) copyFile("vibe.node");

copyFileSync(join("packages", "discord", "package.json"), join("dist", "discord", "package.json"));

console.log("Packing into .asar...");

const asarName = INCLUDE_VIBE ? "app-acrylic.asar" : "app.asar";
execSync(`asar pack ${join("dist", "discord")} ${asarName}`);
