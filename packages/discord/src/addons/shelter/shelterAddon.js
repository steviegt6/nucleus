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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShelterAddon = void 0;
const SHELTER_PRELOAD_SCRIPT = `
const { ipcRenderer, webFrame } = require("electron");

ipcRenderer.invoke("SHELTER_BUNDLE_FETCH").then((bundle) => {
    webFrame.executeJavaScript(bundle);
});

const originalPreload = ipcRenderer.sendSync("SHELTER_ORIGINAL_PRELOAD");
if (originalPreload) require(originalPreload);
`;
function shelterLog(...args) {
    log("ShelterAddon", ...args);
    console.log("[shelter]", ...args);
}
class ShelterAddon {
    constructor() {
        this.name = "shelter";
    }
    load(oaConfig) {
        if (!oaConfig.injectShelter) {
            log("ShelterAddon", "shelter is not enabled, skipping injection...");
            return;
        }
        log("ShelterAddon", "shelter is enabled, injecting...");
        injectShelter();
    }
}
exports.ShelterAddon = ShelterAddon;
const electron_1 = __importDefault(require("electron"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
function injectShelter() {
    shelterLog("Loading...");
    // #region Bundle
    const remoteUrl = process.env.SHELTER_BUNDLE_URL || "https://raw.githubusercontent.com/uwu/shelter-builds/main/shelter.js";
    const localBundle = process.env.SHELTER_DIST_PATH;
    let shelterBundle = "";
    if (localBundle) {
        shelterBundle = fs_1.default.readFileSync(path_1.default.join(localBundle, "shelter.js"), "utf8");
        shelterBundle += `\n//# sourceMappingURL=file:////${path_1.default.join(localBundle, "shelter.js.map")}`;
    }
    else {
        const req = https_1.default.get(remoteUrl);
        req.on("response", (res) => {
            const chunks = [];
            res.on("data", (chunk) => chunks.push(chunk));
            res.on("end", () => {
                shelterBundle = Buffer.concat(chunks).toString("utf-8");
                if (!shelterBundle.includes("//# sourceMappingURL="))
                    shelterBundle += `\n//# sourceMappingURL=${remoteUrl + ".map"}`;
            });
        });
        req.end();
    }
    // #endregion
    // #region IPC
    electron_1.default.ipcMain.on("SHELTER_ORIGINAL_PRELOAD", (event) => {
        // TODO: remove @ts-ignore
        // @ts-ignore
        event.returnValue = event.sender.originalPreload;
    });
    electron_1.default.ipcMain.handle("SHELTER_BUNDLE_FETCH", () => __awaiter(this, void 0, void 0, function* () {
        if (!shelterBundle)
            yield new Promise((r) => setImmediate(r));
        return shelterBundle;
    }));
    // #endregion
    // #region CSP
    // TODO: nucleus: generalize this elsewhere
    electron_1.default.app.on("ready", () => {
        electron_1.default.session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders }, done) => {
            if (responseHeaders === undefined)
                return;
            const cspHeaders = Object.keys(responseHeaders).filter((name) => name.toLowerCase().startsWith("content-security-policy"));
            for (const header of cspHeaders)
                delete responseHeaders[header];
            done({ responseHeaders });
        });
        electron_1.default.session.defaultSession.webRequest.onHeadersReceived = () => { };
    });
    // #endregion
    // #region ProxiedBrowserWindow
    const ProxiedBrowserWindow = new Proxy(electron_1.default.BrowserWindow, {
        construct(target, args) {
            var _a;
            const options = args[0];
            let originalPreload;
            if (((_a = options.webPreferences) === null || _a === void 0 ? void 0 : _a.preload) && options.title && require.main !== undefined) {
                // We replace the preload instead of using setPreloads because of some differences in internal behavior.
                const basePath = path_1.default.join(path_1.default.dirname(require.main.filename), "..");
                fs_1.default.writeFileSync(path_1.default.join(basePath, "shelter-preload.js"), SHELTER_PRELOAD_SCRIPT);
                originalPreload = options.webPreferences.preload;
                options.webPreferences.preload = path_1.default.join(basePath, "shelter-preload.js");
            }
            const window = new target(options);
            // TODO: remove @ts-ignore
            // @ts-ignore
            window.webContents.originalPreload = originalPreload;
            return window;
        }
    });
    const electronPath = require.resolve("electron");
    if (require.cache[electronPath] !== undefined) {
        delete require.cache[electronPath].exports;
        require.cache[electronPath].exports = Object.assign(Object.assign({}, electron_1.default), { BrowserWindow: ProxiedBrowserWindow });
    }
    // #endregion
    // TODO: nucleus: Do we want to bother logging this? Trying to keep parity with the shelter injector...
    shelterLog("Starting original...");
}
