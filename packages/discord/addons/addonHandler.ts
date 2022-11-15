import { SettingsStore } from "../appSettings";
import { ShelterAddon } from "./shelter/shelterAddon";

export interface Addon {
    name: string;

    load(oaConfig: SettingsStore): void;
}

const ADDONS: Addon[] = [new ShelterAddon()];

export default () => {
    ADDONS.forEach((addon) => {
        log("AddonLoader", "Loading addon: " + addon.name);
        addon.load(oaConfig);
    });
};
