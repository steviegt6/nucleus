import { copyFileSync, existsSync } from "fs";
import { getDiscordChannel } from "../utils/commonPrompts";
import { getAsar } from "../utils/findAsar";
import { getStringArg } from "../utils/parseArgs";
import Task from "./task";

const DEFAULT_ASAR_PATH = "app.asar";

export default class CopyTask implements Task {
    name: string = "copy";

    async run(): Promise<void> {
        console.log("Finding Discord app.asar location...");

        const discordChannel = await getDiscordChannel();
        const discordAsar = getDiscordAsar(discordChannel);
        const builtAsar = getBuiltAsar();

        console.log("Copying built .asar file to Discord app.asar location...");
        copyFileSync(builtAsar, discordAsar);
        console.log("Copied built .asar file to Discord app.asar location.");
    }
}

function getDiscordAsar(channel: string): string {
    const asarInstallPath = getAsar(channel);
    if (!asarInstallPath) {
        console.log("Could not find Discord app.asar file.");
        process.exit(1);
    }

    console.log("Found Discord app.asar file at: " + asarInstallPath);
    return asarInstallPath;
}

function getBuiltAsar(): string {
    const builtAsar = getStringArg("--asar-path") || DEFAULT_ASAR_PATH;
    if (!existsSync(builtAsar)) {
        console.log("Could not find built app.asar file at expected path: " + builtAsar);
        process.exit(1);
    }

    return builtAsar;
}
