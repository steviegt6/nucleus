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
const { join } = require("path");
const fs = require("fs");
const Module = require("module");
const { execFile } = require("child_process");
const { app, autoUpdater } = require("electron");
const request = require("request");
const paths = require("../paths");
const mkdir = (x) => fs.mkdirSync(x, { recursive: true });
const events = (exports.events = new (require("events").EventEmitter)());
exports.INSTALLED_MODULE = "installed-module"; // Fixes DiscordNative ensureModule as it uses export
let skipHost, skipModule, remote = {}, installed = {}, downloading, installing, basePath, manifestPath, downloadPath, host, baseUrl, qs, last;
const resetTracking = () => {
    const base = {
        done: 0,
        total: 0,
        fail: 0
    };
    downloading = Object.assign({}, base);
    installing = Object.assign({}, base);
};
exports.init = (endpoint, { releaseChannel, version }) => {
    skipHost = settings.get("SKIP_HOST_UPDATE");
    skipModule = settings.get("SKIP_MODULE_UPDATE");
    basePath = join(paths.getUserDataVersioned(), "modules");
    manifestPath = join(basePath, "installed.json");
    downloadPath = join(basePath, "pending");
    resetTracking();
    Module.globalPaths.push(basePath);
    // Purge pending
    fs.rmSync(downloadPath, { recursive: true, force: true });
    mkdir(downloadPath);
    try {
        installed = JSON.parse(fs.readFileSync(manifestPath));
    }
    catch (_a) {
        for (const m of ["desktop_core", "utils"]) {
            // Ignore actual bootstrap manifest and choose our own core 2, others are deferred
            installed["discord_" + m] = { installedVersion: 0 }; // Set initial version as 0
        }
    }
    host =
        process.platform === "linux"
            ? new (class HostLinux extends require("events").EventEmitter {
                setFeedURL(url) {
                    this.url = url;
                }
                checkForUpdates() {
                    request(this.url, (e, r, b) => {
                        if (e)
                            return this.emit("error");
                        if (r.statusCode === 204)
                            return this.emit("update-not-available");
                        this.emit("update-manually", b);
                    });
                }
                quitAndInstall() {
                    app.relaunch();
                    app.quit();
                }
            })()
            : autoUpdater;
    host.on("update-progress", (progress) => events.emit("downloading-module", { name: "host", progress }));
    host.on("update-manually", (e) => events.emit("manual", e));
    host.on("update-downloaded", host.quitAndInstall);
    host.on("error", () => {
        log("Modules", "Host error");
        events.emit("checked", { failed: true });
    });
    const platform = process.platform === "darwin" ? "osx" : "linux";
    host.setFeedURL(`${endpoint}/updates/${releaseChannel}?platform=${platform}&version=${version}`);
    baseUrl = `${endpoint}/modules/${releaseChannel}`;
    qs = {
        host_version: version,
        platform
    };
};
const checkModules = () => __awaiter(void 0, void 0, void 0, function* () {
    remote = yield new Promise((res) => request({
        url: baseUrl + "/versions.json",
        qs
    }, (e, r, b) => res(JSON.parse(b))));
    for (const name in installed) {
        const inst = installed[name].installedVersion;
        const rem = remote[name];
        if (inst !== rem) {
            log("Modules", "Update:", name, inst, "->", rem);
            downloadModule(name, rem);
        }
    }
    return downloading.total;
});
const downloadModule = (name, ver) => __awaiter(void 0, void 0, void 0, function* () {
    downloading.total++;
    const path = join(downloadPath, name + "-" + ver + ".zip");
    const file = fs.createWriteStream(path);
    // log('Modules', 'Downloading', `${name}@${ver}`);
    let success, total, cur = 0;
    request({
        url: baseUrl + "/" + name + "/" + ver,
        qs
    }).on("response", (res) => {
        var _a;
        success = res.statusCode === 200;
        total = parseInt((_a = res.headers["content-length"]) !== null && _a !== void 0 ? _a : 1, 10);
        res.pipe(file);
        res.on("data", (c) => {
            cur += c.length;
            events.emit("downloading-module", { name, cur, total });
        });
    });
    yield new Promise((res) => file.on("close", res));
    if (success)
        commitManifest();
    else
        downloading.fail++;
    events.emit("downloaded-module", {
        name
    });
    downloading.done++;
    if (downloading.done === downloading.total) {
        events.emit("downloaded", {
            failed: downloading.fail
        });
    }
    installModule(name, ver, path);
});
const installModule = (name, ver, path) => __awaiter(void 0, void 0, void 0, function* () {
    installing.total++;
    // log('Modules', 'Installing', `${name}@${ver}`);
    let err;
    const onErr = (e) => {
        if (err)
            return;
        err = true;
        log("Modules", "Failed install", name, e);
        finishInstall(name, ver, false);
    };
    // Extract zip via unzip cmd line - replaces yauzl dep (speed++, size--, jank++)
    let total = 0, cur = 0;
    execFile("unzip", ["-l", path], (e, o) => { var _a, _b; return (total = parseInt((_b = (_a = o.toString().match(/([0-9]+) files/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 0)); }); // Get total count and extract in parallel
    const ePath = join(basePath, name);
    mkdir(ePath);
    const proc = execFile("unzip", ["-o", path, "-d", ePath]);
    proc.on("error", (e) => {
        if (e.code === "ENOENT") {
            require("electron").dialog.showErrorBox("Failed Dependency", 'Please install "unzip"');
            process.exit(1); // Close now
        }
        onErr(e);
    });
    proc.stderr.on("data", onErr);
    proc.stdout.on("data", (x) => {
        cur += x.toString().split("\n").length;
        events.emit("installing-module", { name, cur, total });
    });
    proc.on("close", () => {
        if (err)
            return;
        installed[name] = { installedVersion: ver };
        commitManifest();
        finishInstall(name, ver, true);
    });
});
const finishInstall = (name, ver, success) => {
    if (!success)
        installing.fail++;
    events.emit("installed-module", {
        name,
        succeeded: true
    });
    installing.done++;
    log("Modules", "Finished", `${name}@${ver}`);
    if (installing.done === downloading.total) {
        if (!installing.fail)
            last = Date.now();
        events.emit("installed", {
            failed: installing.fail
        });
        resetTracking();
    }
};
exports.checkForUpdates = () => __awaiter(void 0, void 0, void 0, function* () {
    log("Modules", "Checking");
    const done = (e = {}) => events.emit("checked", e);
    if (last > Date.now() - 10000)
        return done();
    let p = [];
    if (!skipHost) {
        p.push(new Promise((res) => host.once("update-not-available", res)));
        host.checkForUpdates();
    }
    if (!skipModule)
        p.push(checkModules());
    done({
        count: (yield Promise.all(p)).pop()
    });
});
exports.quitAndInstallUpdates = () => host.quitAndInstall();
exports.isInstalled = (n, v) => installed[n] && !(v && installed[n].installedVersion !== v);
exports.getInstalled = () => (Object.assign({}, installed));
const commitManifest = () => fs.writeFileSync(manifestPath, JSON.stringify(installed, null, 2));
exports.install = (name, def, { version } = {}) => {
    var _a;
    if (exports.isInstalled(name, version)) {
        if (!def)
            events.emit("installed-module", {
                name,
                succeeded: true
            });
        return;
    }
    if (def) {
        installed[name] = { installedVersion: 0 };
        return commitManifest();
    }
    downloadModule(name, (_a = version !== null && version !== void 0 ? version : remote[name]) !== null && _a !== void 0 ? _a : 0);
};
