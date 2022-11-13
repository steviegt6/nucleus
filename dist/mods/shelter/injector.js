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
const shelterPreloadScript = `
const { webFrame, ipcRenderer } = require("electron");

const bundle = ipcRenderer.sendSync("SHELTER_FHDIUSF");
if (bundle) webFrame.executeJavaScript(bundle);
const originalPreload = require("./preload.json").path;
require(originalPreload);
`;
module.exports = () => {
    const electron = require("electron");
    const path = require("path");
    const fs = require("fs");
    const basePath = path.join(path.dirname(require.main.filename), "..");
    const electronCache = require.cache[require.resolve("electron")];
    //#region CSP Removal
    electron.app.on("ready", () => {
        // Removes CSP
        electron.session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders }, done) => {
            const cspHeaders = Object.keys(responseHeaders).filter((name) => name.toLowerCase().startsWith("content-security-policy"));
            for (const header of cspHeaders) {
                delete responseHeaders[header];
            }
            done({ responseHeaders });
        });
        // Prevents other mods from removing CSP
        electronCache.exports.session.defaultSession.webRequest.onHeadersReceived = () => {
            console.log("[RawDog] Prevented CSP from being modified...");
        };
    });
    //#endregion
    let injected = false;
    const { BrowserWindow } = electron;
    const propertyNames = Object.getOwnPropertyNames(electronCache.exports);
    delete electronCache.exports;
    // Make a new electron that will use the new 'BrowserWindow'
    const newElectron = {};
    for (const propertyName of propertyNames) {
        Object.defineProperty(newElectron, propertyName, Object.assign(Object.assign({}, Object.getOwnPropertyDescriptor(electron, propertyName)), { get: () => propertyName === "BrowserWindow"
                ? class extends BrowserWindow {
                    constructor(opts) {
                        if (opts.resizable && !injected) {
                            let originalPreload = JSON.stringify({
                                path: opts.webPreferences.preload
                            });
                            fs.writeFileSync(path.join(basePath, "preload.json"), originalPreload);
                            fs.writeFileSync(path.join(basePath, "shelterPreload.js"), shelterPreloadScript);
                            opts.webPreferences.preload = path.join(basePath, "shelterPreload.js");
                            injected = true;
                        }
                        const window = new BrowserWindow(opts);
                        return window;
                    }
                }
                : electron[propertyName] }));
    }
    electronCache.exports = newElectron;
    (() => __awaiter(void 0, void 0, void 0, function* () {
        let shelterBundle = "";
        const remoteUrl = process.env.SHELTER_BUNDLE_URL || "https://raw.githubusercontent.com/uwu/shelter-builds/main/shelter.js";
        const localBundle = process.env.SHELTER_DIST_PATH;
        try {
            if (localBundle) {
                shelterBundle = readFileSync(resolve(join(localBundle, "shelter.js")), "utf8");
                shelterBundle += `\n//# sourceMappingURL=file:////${resolve(join(localBundle, "shelter.js.map"))}`;
            }
            else {
                // shelterBundle = await (await fetch(remoteUrl)).text();
                let done = false;
                const http = require("https"); // fucking hell
                http.get(remoteUrl, (res) => {
                    res.on("data", (d) => {
                        shelterBundle += d;
                    });
                    res.on("end", () => (done = true));
                });
                while (!done)
                    // don't say i didn't warn you
                    yield new Promise((r) => setTimeout(r));
                if (!shelterBundle.includes("//# sourceMappingURL=")) {
                    shelterBundle += `\n//# sourceMappingURL=${remoteUrl + ".map"}`;
                }
            }
        }
        catch (err) {
            console.error("[shelter-inject] Failed to inject.\n", err);
            const options = {
                type: "error",
                buttons: ["Continue", "Close Discord"],
                defaultId: 0,
                cancelId: 1,
                message: "Shelter failed to load from local dist. \nCheck console for more info.",
                detail: err.message
            };
            let pressedButtonId = electron.dialog.showMessageBoxSync(null, options);
            if (pressedButtonId == 1) {
                process.exit();
            }
        }
        electron.ipcMain.on("SHELTER_FHDIUSF", (event) => {
            event.returnValue = shelterBundle;
        });
        log("ShelterInjector", "Shelter early load hopefully successful.");
        console.log("[shelter-inject] early load hopefully successful");
    }))();
};
