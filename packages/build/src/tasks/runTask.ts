import { readdirSync } from "fs";
import { join } from "path";
import { getDiscordChannel } from "../utils/commonPrompts";
import { getDir } from "../utils/findAsar";
import Task from "./task";
import logExecSync from "../utils/logExec";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";

const PLATFORM_RUNNERS = {
    win32: (dir: string) => {
        const discordDirectory = readdirSync(dir);
        const executable = join(dir, discordDirectory.filter((x) => x.endsWith(".exe"))[0]);
        console.log(`Running ${executable}...`);
        logAndWait(spawn(`"${executable}"`, [], { shell: true, detached: true }));
    },
    darwin: (_dir: string) => {
        console.error("Contribute macOS development support @ https://github.com/steviegt6/nucleus");
    },
    linux: (dir: string) => {
        const discordDirectory = readdirSync(dir);
        const executable = join(dir, discordDirectory.filter((x) => x.toLowerCase().startsWith("discord") && !x.endsWith(".desktop") && !x.endsWith(".png"))[0]);
        console.log(`Running ${executable}...`);
        logAndWait(spawn(executable, { shell: true, detached: true }));
    }
};

function logAndWait(proc: ChildProcessWithoutNullStreams) {
    proc.stdout.on("data", (data) => console.log(data.toString()));
    proc.stderr.on("data", (data) => console.error(data.toString()));
    proc.on("close", (code) => {
        if (code) console.error(`Process exited with code ${code}`);
        else console.log("Process exited successfully");
    });
}

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
