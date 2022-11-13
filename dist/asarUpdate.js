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
const request = require("request");
const fs = require("original-fs"); // Use original-fs, not Electron's modified fs
const { join } = require("path");
const asarPath = join(require.main.filename, "..");
const downloadPath = join(asarPath, "..", "app.asar.download");
const asarUrl = `https://github.com/steviegt6/nucleus/releases/download/${oaVersion.split("-")[0]}/${oaConfig.supportsAcrylic ? "app-acrylic" : "app"}.asar`;
module.exports = () => __awaiter(void 0, void 0, void 0, function* () {
    // (Try) update asar
    log("AsarUpdate", "Updating...");
    if (!oaVersion.includes("-"))
        return;
    yield new Promise((res) => {
        const file = fs.createWriteStream(downloadPath);
        file.on("finish", () => {
            file.close();
            res();
        });
        request.get(asarUrl).on("response", (r) => r.pipe(file));
    });
    if (fs.readFileSync(downloadPath, "utf8").startsWith("<"))
        return log("AsarUpdate", "Download error");
    fs.copyFileSync(downloadPath, asarPath); // Overwrite actual app.asar
    fs.unlinkSync(downloadPath); // Delete downloaded temp file
});
