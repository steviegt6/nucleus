"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
if ("<notrack>" === "true") {
    // Disable sentry
    try {
        window.__SENTRY__.hub.getClient().getOptions().enabled = false;
        Object.keys(console).forEach((x) => { var _a; return (console[x] = (_a = console[x].__sentry_original__) !== null && _a !== void 0 ? _a : console[x]); });
    }
    catch (_a) { }
}
let lastBgPrimary = "";
const themesync = () => __awaiter(void 0, void 0, void 0, function* () {
    const getVar = (name, el = document.body) => { var _a; return el && ((_a = (getComputedStyle(el).getPropertyValue(name) || getVar(name, el.parentElement))) === null || _a === void 0 ? void 0 : _a.trim()); };
    const bgPrimary = getVar("--background-primary");
    if (!bgPrimary || bgPrimary === "#36393f" || bgPrimary === "#fff" || bgPrimary === lastBgPrimary)
        return; // Default primary bg or same as last
    lastBgPrimary = bgPrimary;
    const vars = ["--background-primary", "--background-secondary", "--brand-experiment", "--header-primary", "--text-muted"];
    let cached = (yield DiscordNative.userDataCache.getCached()) || {};
    const value = `body { ${vars.reduce((acc, x) => (acc += `${x}: ${getVar(x)}; `), "")} }`;
    const pastValue = cached["openasarSplashCSS"];
    cached["openasarSplashCSS"] = value;
    if (value !== pastValue)
        DiscordNative.userDataCache.cacheUserData(JSON.stringify(cached));
});
// Settings info version injection
setInterval(() => {
    const host = [...document.querySelectorAll('[class*="info-"] [class*="line-"]')].find((x) => x.textContent.startsWith("Host "));
    if (!host || document.querySelector("#openasar-ver"))
        return;
    const el = document.createElement("span");
    el.id = "openasar-ver";
    el.innerHTML = "nucleus <hash>";
    el.onclick = () => DiscordNative.ipc.send("DISCORD_UPDATED_QUOTES", "o");
    host.append(document.createTextNode(" | "), el);
}, 2000);
const injCSS = (x) => {
    const el = document.createElement("style");
    el.appendChild(document.createTextNode(x));
    document.body.appendChild(el);
};
injCSS(`
[class^="socialLinks-"] + [class^="info-"] {
  padding-right: 0;
}

#openasar-ver {
  text-transform: none;
  cursor: pointer;
}

#openasar-ver:hover {
  text-decoration: underline;
  color: var(--text-normal);
}`);
injCSS("<css>");
openasar = {}; // Define global for any mods which want to know / etc
nucleus = {}; // So people can check if the OpenAsar install is a nucleus distribution
DiscordNative.nativeModules.ensureModule("discord_voice"); // Ensure discord_voice to generally prevent corruption message / broken VC, also for deferring for fresh start
setInterval(() => {
    // Try init themesync
    try {
        themesync();
    }
    catch (e) { }
}, 10000);
themesync();
