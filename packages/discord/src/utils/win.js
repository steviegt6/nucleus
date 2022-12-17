module.exports = (o, n) => {
    const settings =
        vibe?.enabled === true
            ? {
                  backgroundColor: "#00000000",
                  show: n === "config"
                  // menubar: false,
              }
            : {
                  backgroundColor: "#2f3136"
              };
    const w = new (require("electron").BrowserWindow)({
        frame: false,
        resizable: false,
        center: true,
        webPreferences: {
            preload: require("path").join(__dirname, "..", n, "preload.js")
        },
        ...settings,
        ...o
    });

    const c = w.webContents;
    c.once("dom-ready", () => {
        if (oaConfig.themeSync !== false)
            try {
                const userData = JSON.parse(require("fs").readFileSync(require("path").join(require("../paths").getUserData(), "userDataCache.json"), "utf8"));
                c.insertCSS(userData.nucleusCss);
                c.insertCSS(userData.openasarSplashCSS);
            } catch {}
    });

    if (n === "config")
        c.on("new-window", (e, url) => {
            e.preventDefault();
            console.log("Prevented new window from opening in config: " + url);
            require("electron").shell.openExternal(url);
        });

    w.loadURL("http://localhost:3000/" + n + "?v=" + oaVersion);

    if (vibe?.enabled === true) {
        w.webContents.insertCSS("html, body { background: transparent !important; }");
        vibe.applyEffect(w, "acrylic");
    }
    return w;
};
