"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = exports.Settings = exports.SettingsStore = void 0;
const fs_1 = __importDefault(require("fs"));
class SettingsStore {
    constructor() {
        this.acrylicWindow = false;
        this.supportsAcrylic = false;
        this.injectShelter = false;
    }
}
exports.SettingsStore = SettingsStore;
class Settings {
    // Heavily based on original for compat, but simplified and tweaked
    constructor(path) {
        try {
            this.store = JSON.parse(fs_1.default.readFileSync(path, "utf8"));
        }
        catch (_a) {
            this.store = [];
        }
        this.path = path;
        this.mod = this.getMod();
        log("Settings", this.path, this.store);
    }
    getMod() {
        // Get when file was last modified
        try {
            return fs_1.default.statSync(this.path).mtime.getTime();
        }
        catch (_a) { }
    }
    get(k, d = undefined) {
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
            fs_1.default.writeFileSync(this.path, JSON.stringify(this.store, null, 2));
            this.mod = this.getMod();
            log("Settings", "Saved");
        }
        catch (e) {
            log("Settings", e);
        }
    }
}
exports.Settings = Settings;
let inst; // Instance of class
function getSettings() {
    return (inst = inst !== null && inst !== void 0 ? inst : new Settings(require("path").join(require("./paths").getUserData(), "settings.json")));
}
exports.getSettings = getSettings;
