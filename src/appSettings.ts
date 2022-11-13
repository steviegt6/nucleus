import fs from "fs";

export class SettingsStore {
    acrylicWindow: boolean;
    supportsAcrylic: boolean;

    constructor() {
        this.acrylicWindow = false;
        this.supportsAcrylic = false;
    }
}

export class Settings {
    store: any[string];
    path: string;
    mod: any | undefined;

    // Heavily based on original for compat, but simplified and tweaked
    constructor(path: string) {
        try {
            this.store = JSON.parse(fs.readFileSync(path, "utf8"));
        } catch {
            this.store = [];
        }

        this.path = path;
        this.mod = this.getMod();

        log("Settings", this.path, this.store);
    }

    getMod() {
        // Get when file was last modified
        try {
            return fs.statSync(this.path).mtime.getTime();
        } catch {}
    }

    get(k: string, d: any): any {
        return this.store[k] ?? d;
    }

    set(k: string, v: any): void {
        this.store[k] = v;
    }

    save(): void {
        if (this.mod && this.mod !== this.getMod()) return; // File was last modified after Settings was made, so was externally edited therefore we don't save over

        try {
            fs.writeFileSync(this.path, JSON.stringify(this.store, null, 2));
            this.mod = this.getMod();

            log("Settings", "Saved");
        } catch (e) {
            log("Settings", e);
        }
    }
}

let inst: Settings; // Instance of class
export function getSettings(): Settings {
    return (inst = inst ?? new Settings(require("path").join(require("./paths").getUserData(), "settings.json")));
}
