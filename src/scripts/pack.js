// asar pack dist app.asar

const { execSync } = require("child_process");
const { copyFileSync, mkdirSync, existsSync } = require("fs");
const { join } = require("path");

const INCLUDE_VIBE = process.argv.indexOf("--include-vibe") !== -1;

function copyFile(name) {
    copyFileSync(join("src", name), join("dist", name));
}

console.log("Copying over files before packing into .asar...   INCLUDE_VIBE: " + INCLUDE_VIBE);

if (INCLUDE_VIBE) copyFile("vibe.node");
copyFile("package.json");
if (!existsSync(join("dist", "node_modules"))) mkdirSync(join("dist", "node_modules"));
copyFile(join("node_modules", "mime-types.js"));
copyFile(join("node_modules", "request.js"));
copyFile("package.json");

console.log("Packing into .asar...");

const asarName = INCLUDE_VIBE ? "app-acrylic.asar" : "app.asar";
execSync(`asar pack dist ${asarName}`);
