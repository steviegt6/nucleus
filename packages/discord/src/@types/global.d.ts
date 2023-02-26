import { Settings, SettingsStore } from "../appSettings";

declare global {
    var oaVersion: string;
    var releaseChannel: string;
    var systemElectron: boolean;
    var settings: Settings;
    var oaConfig: SettingsStore;

    function log(area: string, ...args: any[]): void;
}

export {};
