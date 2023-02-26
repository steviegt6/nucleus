const { contextBridge, ipcRenderer } = require("electron");

const addedStyleSheets = [];

function cleanUpEnvironment(html) {
    // clear classes from html
    for (const clazz of html.classList) html.classList.remove(clazz);

    // remove any added stylesheets
    for (const styleSheet of addedStyleSheets) {
        document.head.removeChild(styleSheet);
        styleSheet.remove();
    }
}

ipcRenderer.on("run-environment-initializer", (e, userData) => {
    const html = document.getElementsByTagName("html")[0];
    cleanUpEnvironment(html);

    function injectCss(css, id) {
        // match /src: url\(\"\/assets\/(.*?)\.woff2\"\)/gm
        css = css.replace(/src: url\("\/assets\/(.*?)\.woff2"\)/gm, 'src: url("https://discord.com/assets/$1.woff2")');

        const styleSheet = document.createElement("style");
        styleSheet.innerText = css;
        if (id) styleSheet.id = id;
        document.head.appendChild(styleSheet);
        addedStyleSheets.push(styleSheet);
    }

    try {
        injectCss(userData.nucleusCss, "nucleus-discord-styles");
        injectCss(userData.openasarSplashCSS);

        for (const clazz of userData.nucleusHtmlClasses.split(",")) if (clazz) html.classList.add(clazz);
    } catch {}
});

contextBridge.exposeInMainWorld("Native", {
    edit: () => ipcRenderer.send("NUCLEUS_EDIT"),
    restart: () => ipcRenderer.send("cr"),
    set: (c) => ipcRenderer.send("cs", c),
    get: () => ipcRenderer.sendSync("cg"),
    open: () => ipcRenderer.send("of"),
    closeWindow: () => ipcRenderer.send("winev", "close"),
    maximizeWindow: () => ipcRenderer.send("winev", "maximize"),
    minimizeWindow: () => ipcRenderer.send("winev", "minimize"),
    initializeEnvironment: () => ipcRenderer.send("initialize-environment")
});
