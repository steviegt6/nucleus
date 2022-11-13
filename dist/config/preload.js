"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("Native", {
    edit: () => ipcRenderer.send("NUCLEUS_EDIT"),
    restart: () => ipcRenderer.send("cr"),
    set: (c) => ipcRenderer.send("cs", c),
    get: () => ipcRenderer.sendSync("cg"),
    open: () => ipcRenderer.send("of")
});
