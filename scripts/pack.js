// asar pack dist app.asar

const { execSync } = require("child_process");
const { copyFileSync, mkdirSync } = require("fs");
const { join } = require("path");

const IGNORE_VIBE = process.argv.indexOf("--ignore-vibe") !== -1;

function copyFile(name) {
    copyFileSync(join("src", name), join("dist", name));
}

console.log("Copying over files before packing into .asar...");

if (!IGNORE_VIBE) copyFile("vibe.node");
copyFile("package.json");
mkdirSync(join("dist", "node_modules"));
copyFile(join("node_modules", "mime-types.js"));
copyFile(join("node_modules", "request.js"));
copyFile("package.json");

console.log("Packing into .asar...");

const asarName = IGNORE_VIBE ? "app.asar" : "app-acrylic.asar";
execSync(`asar pack dist ${asarName}.asar`);
