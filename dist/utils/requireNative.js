"use strict";
// Custom requireNative as Electron >=17 breaks Module.globalPaths for some reason
// For Updater v2: get direct path in globalPaths (g[0])
// For Module Updater: get root path for all modules in globalPaths
const g = require("module").globalPaths;
module.exports = (n, e = "") => { var _a; return require(require("path").join((_a = g.reverse().find((x) => x.includes(n))) !== null && _a !== void 0 ? _a : g[0], n, e)); };
