const p = "Discord"; // Product name
const d = "https://discord.com"; // Domain

const r = releaseChannel; // Release channel
const s = r === "stable" ? "" : r[0].toUpperCase() + r.slice(1); // Suffix per release channel (stable = blank, canary = Canary, etc)
const n = p + s; // Name as Discord<Channel> (if not stable)

export const APP_COMPANY = p + " Inc";
export const APP_DESCRIPTION = p + " - " + d;
export const APP_NAME = n;
export const APP_NAME_FOR_HUMANS = (p + " " + s).trim();
export const APP_ID = ["com", "squirrel", n, n].join(".");
export const APP_PROTOCOL = p;
export const API_ENDPOINT = settings.get("API_ENDPOINT") || d + "/api";
export const NEW_UPDATE_ENDPOINT = settings.get("NEW_UPDATE_ENDPOINT") || d + "/api/updates/";
export const UPDATE_ENDPOINT = settings.get("UPDATE_ENDPOINT") || d + "/api";
