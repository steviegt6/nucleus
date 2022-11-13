import fs from "fs";

class Settings {
    store: Map<string, any>;
    path: string;
    mod: any | undefined;

    // Heavily based on original for compat, but simplified and tweaked
    constructor(path: string) {
        try {
            this.store = JSON.parse(fs.readFileSync(path, "utf8"));
        } catch {
            this.store = new Map();
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
        return this.store.get(k) ?? d;
    }

    set(k: string, v: any): void {
        this.store.set(k, v);
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
export function getSettings() {
    inst = inst ?? new Settings(require("path").join(require("./paths").getUserData(), "settings.json"));
}
