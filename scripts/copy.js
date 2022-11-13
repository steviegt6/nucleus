const { writeFileSync, readFileSync, existsSync } = require("fs");
const { getAsar } = require("./utils/findAsar");

const DIST_TYPE = process.argv[2] || "canary";
const ASAR_INSTALL_PATH = getAsar(DIST_TYPE);

if (ASAR_INSTALL_PATH === undefined) {
    console.error("Could not find Discord app.asar file for distribution: " + DIST_TYPE);
    return;
}

if (!existsSync("app.asar")) {
    console.error("Could not find app.asar file in current directory, have you built yet?");
    return;
}

console.log("Copying app.asar to " + ASAR_INSTALL_PATH + "...");
writeFileSync(ASAR_INSTALL_PATH, readFileSync("app.asar"));
console.log("Copied app.asar to " + ASAR_INSTALL_PATH + "!");
