import { copyFileSync } from "fs";
import { join } from "path";
import Task from "./task";
import logExecSync from "../utils/logExec";

export default class PackTask implements Task {
    name: string = "pack";

    async run(): Promise<void> {
        console.log("Copying over files before packing into .asar...");

        copyFile(join("packages", "bootstrapper", "package.json"), join("dist", "bootstrapper", "package.json"));

        const asarName = "app.asar";
        console.log("Packing into .asar: " + asarName);
        logExecSync(`asar pack ${join("dist", "bootstrapper")} ${asarName}`);
    }
}

function copyFile(from: string, to: string) {
    console.log(`Copying \"${from}\" to \"${to}\"...`);
    copyFileSync(from, to);
}
