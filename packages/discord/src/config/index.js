const { ipcMain, app, shell, BrowserWindow } = require("electron");

ipcMain.on("DISCORD_UPDATED_QUOTES", (e, c) => {
    if (c === "o") exports.open();
});

ipcMain.on("of", () => {
    shell.openPath(require("../paths").getUserData() + "/settings.json");
});

ipcMain.on("winev", (e, c) => {
    const window = BrowserWindow.fromWebContents(e.sender);

    switch (c) {
        case "close":
            window.close();
            break;

        case "maximize":
            if (window.isMaximized()) window.unmaximize();
            else window.maximize();
            break;

        case "minimize":
            window.minimize();
            break;
    }
});

exports.open = () => {
    const win = require("../utils/win")(
        {
            width: 950,
            height: 700
        },
        "config"
    );

    win.resizable = true;

    let config = settings.get("openasar", {});
    config.setup = true;
    settings.set("openasar", config);
    settings.save();

    ipcMain.on("NUCLEUS_EDIT", () => {
        // LEGACY
        /*settings.set('openasar', config);
    settings.save();
    shell.openPath(require('../paths').getUserData() + '/settings.json');*/
    });

    ipcMain.on("cs", (e, c) => {
        config = c;
        settings.set("openasar", config);
        settings.save();
    });

    ipcMain.on("cg", (e) => {
        e.returnValue = config;
    });

    ipcMain.on("cr", () => {
        settings.save();
        app.relaunch();
        app.exit();
    });
};
