const SHELTER_PRELOAD_SCRIPT = `
const { ipcRenderer, webFrame } = require("electron");

ipcRenderer.invoke("SHELTER_BUNDLE_FETCH").then((bundle) => {
    webFrame.executeJavaScript(bundle);
});

const originalPreload = ipcRenderer.sendSync("SHELTER_ORIGINAL_PRELOAD");
if (originalPreload) require(originalPreload);
`;

module.exports = () => {
    const electron = require("electron");
    const path = require("path");
    const fs = require("fs");
    const https = require("https");

    function logShelter(...args) {
        global.log("ShelterInjector", ...args);
        console.log("[shelter]", ...args);
    }

    logShelter("Loading...");

    // #region Bundle

    const remoteUrl = process.env.SHELTER_BUNDLE_URL || "https://raw.githubusercontent.com/uwu/shelter-builds/main/shelter.js";
    const localBundle = process.env.SHELTER_DIST_PATH;

    let shelterBundle = "";

    if (localBundle) {
        shelterBundle = fs.readFileSync(path.join(localBundle, "shelter.js"), "utf8");
        shelterBundle += `\n//# sourceMappingURL=file:////${path.join(localBundle, "shelter.js.map")}`;
    } else {
        const req = https.get(remoteUrl);

        req.on("response", (res) => {
            const chunks = [];

            res.on("data", (chunk) => chunks.push(chunk));
            res.on("end", () => {
                shelterBundle = Buffer.concat(chunks).toString("utf-8");

                if (!shelterBundle.includes("//# sourceMappingURL=")) shelterBundle += `\n//# sourceMappingURL=${remoteUrl + ".map"}`;
            });
        });

        req.end();
    }

    // #endregion

    // #region IPC

    electron.ipcMain.on("SHELTER_ORIGINAL_PRELOAD", (event) => {
        event.returnValue = event.sender.originalPreload;
    });

    electron.ipcMain.handle("SHELTER_BUNDLE_FETCH", async (event) => {
        if (!shelterBundle) await Promise((r) => setImmediate(r));
        return shelterBundle;
    });

    // #endregion

    // #region CSP

    // TODO: nucleus: generalize this elsewhere
    electron.app.on("ready", () => {
        electron.session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders }, done) => {
            const cspHeaders = Object.keys(responseHeaders).filter((name) => name.toLowerCase().startsWith("content-security-policy"));
            for (const header of cspHeaders) delete responseHeaders[header];
            done({ responseHeaders });
        });

        electron.session.defaultSession.webRequest.onHeadersReceived = () => {};
    });

    // #endregion

    // #region ProxiedBrowserWindow

    const ProxiedBrowserWindow = new Proxy(electron.BrowserWindow, {
        construct(target, args) {
            const options = args[0];
            let originalPreload;

            if (options.webPreferences?.preload && options.title) {
                // We replace the preload instead of using setPreloads because of some differences in internal behavior.
                const basePath = path.join(path.dirname(require.main.filename), "..");
                fs.writeFileSync(path.join(basePath, "shelter-preload.js"), SHELTER_PRELOAD_SCRIPT);

                originalPreload = options.webPreferences.preload;
                options.webPreferences.preload = path.join(basePath, "shelter-preload.js");
            }

            const window = new target(options);
            window.webContents.originalPreload = originalPreload;
            return window;
        }
    });

    const electronPath = require.resolve("electron");
    delete require.cache[electronPath].exports;
    require.cache[electronPath].exports = {
        ...electron,
        BrowserWindow: ProxiedBrowserWindow
    };

    // #endregion

    // TODO: nucleus: Do we want to bother logging this? Trying to keep parity with the shelter injector...
    logShelter("Starting original...");
};
