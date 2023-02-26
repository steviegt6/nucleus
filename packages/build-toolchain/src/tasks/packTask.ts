import { execSync } from "child_process";
import { copyFileSync } from "fs";
import { join } from "path";
import { getArgBool } from "../utils/parseArgs";
import Task from "./task";

export default class PackTask implements Task {
    name: string = "pack";

    async run(): Promise<void> {
        console.log("Copying over files before packing into .asar...");

        copyFile(join("packages", "discord", "package.json"), join("dist", "discord", "package.json"));

        const asarName = "app.asar";
        console.log("Packing into .asar: " + asarName);
        execSync(`asar pack ${join("dist", "discord")} ${asarName}`);
    }
}

function copyFile(from: string, to: string) {
    console.log(`Copying \"${from}\" to \"${to}\"...`);
    copyFileSync(from, to);
}
