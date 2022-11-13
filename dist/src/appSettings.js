"use strict";
const fs = require("fs");
class Settings {
    // Heavily based on original for compat, but simplified and tweaked
    constructor(path) {
        try {
            this.store = JSON.parse(fs.readFileSync(path));
        }
        catch (_a) {
            this.store = {};
        }
        this.path = path;
        this.mod = this.getMod();
        log("Settings", this.path, this.store);
    }
    getMod() {
        // Get when file was last modified
        try {
            return fs.statSync(this.path).mtime.getTime();
        }
        catch (_a) { }
    }
    get(k, d) {
        var _a;
        return (_a = this.store[k]) !== null && _a !== void 0 ? _a : d;
    }
    set(k, v) {
        this.store[k] = v;
    }
    save() {
        if (this.mod && this.mod !== this.getMod())
            return; // File was last modified after Settings was made, so was externally edited therefore we don't save over
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.store, null, 2));
            this.mod = this.getMod();
            log("Settings", "Saved");
        }
        catch (e) {
            log("Settings", e);
        }
    }
}
let inst; // Instance of class
exports.getSettings = () => (inst = inst !== null && inst !== void 0 ? inst : new Settings(require("path").join(require("./paths").getUserData(), "settings.json")));
