const { execSync } = require("child_process");

console.log("Building with tsc...");
execSync("tsc -p ./packages/discord/tsconfig.json");
require("./pack.js");
require("./copy.js");
require("./run.js");
