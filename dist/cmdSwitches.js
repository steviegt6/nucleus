"use strict";
const { app } = require("electron");
const presets = {
    base: "--autoplay-policy=no-user-gesture-required --disable-features=WinRetrieveSuggestionsOnlyOnDemand,HardwareMediaKeyHandling,MediaSessionService",
    perf: "--enable-gpu-rasterization --enable-zero-copy --ignore-gpu-blocklist --enable-hardware-overlays=single-fullscreen,single-on-top,underlay --enable-features=EnableDrDc,CanvasOopRasterization,BackForwardCache:TimeToLiveInBackForwardCacheInSeconds/300/should_ignore_blocklists/true/enable_same_site/true,ThrottleDisplayNoneAndVisibilityHiddenCrossOriginIframes,UseSkiaRenderer,WebAssemblyLazyCompilation --disable-features=Vulkan --force_high_performance_gpu",
    battery: "--enable-features=TurnOffStreamingMediaCachingOnBattery --force_low_power_gpu" // Known to have better battery life for Chromium?
};
module.exports = () => {
    let c = {};
    for (const x of ("base," + (oaConfig.cmdPreset || "perf")).split(",").reduce((a, x) => { var _a; return a.concat((_a = presets[x]) === null || _a === void 0 ? void 0 : _a.split(" ")); }, [])) {
        if (!x)
            continue;
        const [k, v] = x.split("=");
        (c[k] = c[k] || []).push(v);
    }
    for (const k in c) {
        app.commandLine.appendSwitch(k.replace("--", ""), c[k].join(","));
    }
};
