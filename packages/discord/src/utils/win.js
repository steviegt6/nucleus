module.exports = (o, n) => {
    const settings = {
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

    if (n === "config")
        c.on("new-window", (e, url) => {
            e.preventDefault();
            console.log("Prevented new window from opening in config: " + url);
            require("electron").shell.openExternal(url);
        });

    w.loadURL("https://cdn.nucleus.tomat.dev/" + n + "?v=" + oaVersion);
    return w;
};
