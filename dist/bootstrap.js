"use strict";
var _a;
const { app, session } = require("electron");
const { readFileSync } = require("fs");
const get = require("request");
const { join } = require("path");
if (!settings.get("enableHardwareAcceleration", true))
    app.disableHardwareAcceleration();
process.env.PULSE_LATENCY_MSEC = (_a = process.env.PULSE_LATENCY_MSEC) !== null && _a !== void 0 ? _a : 30;
const buildInfo = require("./utils/buildInfo");
app.setVersion(buildInfo.version); // More global because discord / electron
global.releaseChannel = buildInfo.releaseChannel;
log("BuildInfo", buildInfo);
const Constants = require("./Constants");
app.setAppUserModelId(Constants.APP_ID);
app.name = "discord"; // Force name as sometimes breaks
const fatal = (e) => log("Fatal", e);
process.on("uncaughtException", console.error);
const splash = require("./splash");
const updater = require("./updater/updater");
const moduleUpdater = require("./updater/moduleUpdater");
const autoStart = require("./autoStart");
let desktopCore;
const startCore = () => {
    if (oaConfig.js || oaConfig.css)
        session.defaultSession.webRequest.onHeadersReceived((d, cb) => {
            delete d.responseHeaders["content-security-policy"];
            cb(d);
        });
    app.on("browser-window-created", (e, bw) => {
        // Main window injection
        bw.webContents.on("dom-ready", () => {
            var _a;
            if (!bw.resizable)
                return; // Main window only
            splash.pageReady(); // Override Core's pageReady with our own on dom-ready to show main window earlier
            const [channel, hash] = oaVersion.split("-"); // Split via -
            bw.webContents.executeJavaScript(readFileSync(join(__dirname, "mainWindow.js"), "utf8")
                .replaceAll("<hash>", hash || "custom")
                .replaceAll("<notrack>", oaConfig.noTrack)
                .replace("<css>", ((_a = oaConfig.css) !== null && _a !== void 0 ? _a : "").replaceAll("\\", "\\\\").replaceAll("`", "\\`")));
            if (oaConfig.js)
                bw.webContents.executeJavaScript(oaConfig.js);
            if ((vibe === null || vibe === void 0 ? void 0 : vibe.enabled) === true) {
                bw.setBackgroundColor("#00000000");
                vibe.applyEffect(bw, "acrylic");
            }
        });
    });
    desktopCore = require("./utils/requireNative")("discord_desktop_core");
    desktopCore.startup({
        splashScreen: splash,
        moduleUpdater,
        buildInfo,
        Constants,
        updater,
        autoStart,
        // Just requires
        appSettings: require("./appSettings"),
        paths: require("./paths"),
        // Stubs
        GPUSettings: {
            replace: () => { }
        },
        crashReporterSetup: {
            isInitialized: () => true,
            metadata: {}
        }
    });
};
const startUpdate = () => {
    var _a, _b;
    const urls = [oaConfig.noTrack !== false ? "https://*/api/v9/science" : "", oaConfig.noTyping === true ? "https://*/api/*/typing" : ""].filter((x) => x);
    if (urls.length > 0)
        session.defaultSession.webRequest.onBeforeRequest({ urls }, (e, cb) => cb({ cancel: true }));
    const startMin = (_b = (_a = process.argv) === null || _a === void 0 ? void 0 : _a.includes) === null || _b === void 0 ? void 0 : _b.call(_a, "--start-minimized");
    if (updater.tryInitUpdater(buildInfo, Constants.NEW_UPDATE_ENDPOINT)) {
        const inst = updater.getUpdater();
        inst.on("host-updated", () => autoStart.update(() => { }));
        inst.on("unhandled-exception", fatal);
        inst.on("InconsistentInstallerState", fatal);
        inst.on("update-error", console.error);
        require("./winFirst").do(inst);
    }
    else {
        moduleUpdater.init(Constants.UPDATE_ENDPOINT, buildInfo);
    }
    splash.events.once("APP_SHOULD_LAUNCH", () => {
        if (!process.env.OPENASAR_NOSTART)
            startCore();
    });
    let done;
    splash.events.once("APP_SHOULD_SHOW", () => {
        if (done)
            return;
        done = true;
        desktopCore.setMainWindowVisible(!startMin);
        setTimeout(() => {
            // Try to update our asar
            const config = require("./config");
            if (oaConfig.setup !== true)
                config.open();
            if (oaConfig.autoupdate !== false) {
                try {
                    require("./asarUpdate")();
                }
                catch (e) {
                    log("AsarUpdate", e);
                }
            }
        }, 3000);
    });
    splash.initSplash(startMin);
};
module.exports = () => {
    var _a, _b;
    app.on("second-instance", (e, a) => {
        var _a;
        (_a = desktopCore === null || desktopCore === void 0 ? void 0 : desktopCore.handleOpenUrl) === null || _a === void 0 ? void 0 : _a.call(desktopCore, a.includes("--url") && a[a.indexOf("--") + 1]); // Change url of main window if protocol is used (uses like "discord --url -- discord://example")
    });
    if (!app.requestSingleInstanceLock() && !(((_b = (_a = process.argv) === null || _a === void 0 ? void 0 : _a.includes) === null || _b === void 0 ? void 0 : _b.call(_a, "--multi-instance")) || oaConfig.multiInstance === true))
        return app.quit();
    if (app.isReady())
        startUpdate();
    else
        app.once("ready", startUpdate);
};