const { execSync } = require("child_process");

console.log("Building with tsc...");
execSync("tsc");
require("./pack.js");
require("./copy.js");
require("./run.js");
