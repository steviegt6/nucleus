const { execSync } = require("child_process");
const { readdirSync } = require("fs");
const { join } = require("path");
const { getDir } = require("./utils/findAsar");

const DIST_TYPE = process.argv[2] || "canary";
const DISCORD_DIRECTORY = getDir(DIST_TYPE);

const PLATFORM_RUNNERS = {
    win32: (dir) => {
        const discordDirectory = readdirSync(dir);
        const executable = join(dir, discordDirectory.filter((x) => x.endsWith(".exe"))[0]);
        console.log("Running " + executable + "...");
        execSync(`start "discord (nucleus dev)" "${executable}"`);
    },
    darwin: () => {
        console.error("Contribute macOS development support @ https://github.com/steviegt6/nucleus");
    },
    linux: (dir) => {
        const discordDirectory = readdirSync(dir);
        const executable = join(dir, discordDirectory.filter((x) => x.toLowerCase().startsWith("discord") && !x.endsWith(".desktop") && !x.endsWith(".png"))[0]);
        console.log("Running " + executable + "...");
        execSync(`"${executable}"`);
    }
};

PLATFORM_RUNNERS[process.platform](DISCORD_DIRECTORY);
