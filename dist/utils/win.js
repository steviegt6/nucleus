"use strict";
module.exports = (o, n) => {
    const settings = (vibe === null || vibe === void 0 ? void 0 : vibe.enabled) === true
        ? {
            backgroundColor: "#00000000",
            show: n === "config"
            // menubar: false,
        }
        : {
            backgroundColor: "#2f3136"
        };
    const w = new (require("electron").BrowserWindow)(Object.assign(Object.assign({ frame: false, resizable: false, center: true, webPreferences: {
            preload: require("path").join(__dirname, "..", n, "preload.js")
        } }, settings), o));
    const c = w.webContents;
    c.once("dom-ready", () => {
        if (oaConfig.themeSync !== false)
            try {
                c.insertCSS(JSON.parse(require("fs").readFileSync(require("path").join(require("../paths").getUserData(), "userDataCache.json"), "utf8")).openasarSplashCSS);
            }
            catch (_a) { }
    });
    w.loadURL("https://cdn.nucleus.tomat.dev/" + n + "?v=" + oaVersion);
    if ((vibe === null || vibe === void 0 ? void 0 : vibe.enabled) === true) {
        w.webContents.insertCSS("html, body { background: transparent !important; }");
        vibe.applyEffect(w, "acrylic");
    }
    return w;
};
