"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shelterAddon_1 = require("./shelter/shelterAddon");
const ADDONS = [new shelterAddon_1.ShelterAddon()];
exports.default = () => {
    ADDONS.forEach((addon) => {
        log("AddonLoader", "Loading addon: " + addon.name);
        addon.load(oaConfig);
    });
};
