if ("<notrack>" === "true") {
    // Disable sentry
    try {
        window.__SENTRY__.hub.getClient().getOptions().enabled = false;

        Object.keys(console).forEach((x) => (console[x] = console[x].__sentry_original__ ?? console[x]));
    } catch {}
}

let lastBgPrimary = "";
const themesync = async () => {
    const getVar = (name, el = document.body) => el && (getComputedStyle(el).getPropertyValue(name) || getVar(name, el.parentElement))?.trim();

    const bgPrimary = getVar("--background-primary");
    if (!bgPrimary || bgPrimary === "#36393f" || bgPrimary === "#fff" || bgPrimary === lastBgPrimary) return; // Default primary bg or same as last
    lastBgPrimary = bgPrimary;

    const vars = ["--background-primary", "--background-secondary", "--brand-experiment", "--header-primary", "--text-muted"];

    let cached = (await DiscordNative.userDataCache.getCached()) || {};
    let modified = false;

    const value = `body { ${vars.reduce((acc, x) => (acc += `${x}: ${getVar(x)}; `), "")} }`;
    const pastValue = cached["openasarSplashCSS"];
    cached["openasarSplashCSS"] = value;
    modified |= value !== pastValue;

    // TEMPORARY HACK:
    let css = "";
    for (const sheet of document.styleSheets) for (const rule of sheet.cssRules) css += rule.cssText;
    const pastCss = cached["nucleusCss"];
    cached["nucleusCss"] = css;
    modified = modified || css !== pastCss;

    const html = document.getElementsByTagName("html")[0];
    let htmlClasses = "";
    for (const clazz of html.classList) htmlClasses += `${clazz},`;
    const passHtmlClasses = cached["nucleusHtmlClasses"];
    cached["nucleusHtmlClasses"] = htmlClasses;
    modified = modified || htmlClasses !== passHtmlClasses;

    if (modified) DiscordNative.userDataCache.cacheUserData(JSON.stringify(cached));
};

// Settings info version injection
setInterval(() => {
    const host = [...document.querySelectorAll('[class*="info-"] [class*="line-"]')].find((x) => x.textContent.startsWith("Host "));
    if (!host || document.querySelector("#openasar-ver")) return;

    const el = document.createElement("span");
    el.id = "openasar-ver";

    el.innerHTML = "nucleus <hash>";
    el.onclick = () => DiscordNative.ipc.send("DISCORD_UPDATED_QUOTES", "o");

    host.append(document.createTextNode(" | "), el);
}, 2000);

const injCSS = (x) => {
    const el = document.createElement("style");
    el.appendChild(document.createTextNode(x));
    document.body.appendChild(el);
};

injCSS(`
[class^="socialLinks-"] + [class^="info-"] {
  padding-right: 0;
}

#openasar-ver {
  text-transform: none;
  cursor: pointer;
}

#openasar-ver:hover {
  text-decoration: underline;
  color: var(--text-normal);
}`);

// prettier-ignore
// eslint-disable-next-line quotes
injCSS(`<css>`);

openasar = {}; // Define global for any mods which want to know / etc
nucleus = {}; // So people can check if the OpenAsar install is a nucleus distribution

setInterval(() => {
    // Try init themesync
    try {
        themesync();
    } catch (e) {}
}, 10000);
themesync();

// ipcMain.on("request-nucleus-theme-sync", () => themesync());
