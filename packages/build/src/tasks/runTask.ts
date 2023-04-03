import { readdirSync } from "fs";
import { join } from "path";
import { getDiscordChannel } from "../utils/commonPrompts";
import { getDir } from "../utils/findAsar";
import Task from "./task";
import logExecSync from "../utils/logExec";

const PLATFORM_RUNNERS = {
    win32: (dir: string) => {
        const discordDirectory = readdirSync(dir);
        const executable = join(dir, discordDirectory.filter((x) => x.endsWith(".exe"))[0]);
        console.log(`Running ${executable}...`);
        logExecSync(`start "discord (nucleus dev)" "${executable}"`);
    },
    darwin: (_dir: string) => {
        console.error("Contribute macOS development support @ https://github.com/steviegt6/nucleus");
    },
    linux: (dir: string) => {
        const discordDirectory = readdirSync(dir);
        const executable = join(dir, discordDirectory.filter((x) => x.toLowerCase().startsWith("discord") && !x.endsWith(".desktop") && !x.endsWith(".png"))[0]);
        console.log(`Running ${executable}...`);
        logExecSync(`"${executable}"`);
    }
};

export default class RunTask implements Task {
    name: string = "run";

    async run(): Promise<void> {
        console.log("Finding Discord install location...");

        const discordChannel = await getDiscordChannel();
        const discordDir = getDir(discordChannel);

        console.log("Running Discord...");
        console.log("Using directory: " + discordDir);
        PLATFORM_RUNNERS[process.platform](discordDir);
    }
}
