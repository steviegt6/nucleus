import { Settings, SettingsStore } from "../appSettings";

export class Vibe {
    enabled: boolean;

    setup(app: Electron.App): void;
}

declare global {
    var oaVersion: string;
    var systemElectron: boolean;
    var settings: Settings;
    var oaConfig: SettingsStore;
    var vibe: Vibe;

    function log(area: string, ...args: any[]): void;
}

export {};
