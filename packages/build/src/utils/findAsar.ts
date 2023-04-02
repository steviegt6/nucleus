// Paths and some resolution logic taken from https://github.com/replugged-org/replugged/blob/main/injectors/

import { execSync } from "child_process";
import { existsSync, readdirSync } from "fs";
import { join } from "path";

// grep instances of LOGNAME in /etc/passwd, pipe output to cut, cut line by ":" and get the 6th field
// example grep output: name:x:1000:1000:,,,:/home/name:/bin/bash
//                                           ^^^^^^^^^^ we want this
const HOME_DIR = process.platform === "linux" ? execSync('grep $(logname) /etc/passwd | cut -d ":" -f6').toString().trim() : "";
const FLATPAK_DIR = "/var/lib/flatpak/app/com.discordapp";
const HOME_FLATPAK_DIR = `${HOME_DIR}/.local/share/flatpak/app/com.discordapp`;

const SEARCH_DIRECTORIES = {
    stable: {
        win32: [winPath("Discord")],
        darwin: ["/Applications/Discord.app/Contents"],
        linux: ["/usr/share/discord", "/usr/lib64/discord", "/opt/discord", "/opt/Discord", `${FLATPAK_DIR}.Discord/current/active/files/discord`, `${HOME_FLATPAK_DIR}.Discord/current/active/files/discord`, `${HOME_DIR}/.local/bin/Discord`]
    },
    ptb: {
        win32: [winPath("DiscordPTB")],
        darwin: ["/Applications/Discord PTB.app/Contents"],
        linux: ["/usr/share/discord-ptb", "/usr/lib64/discord-ptb", "/opt/discord-ptb", "/opt/DiscordPTB", `${HOME_DIR}/.local/bin/DiscordPTB`]
    },
    canary: {
        win32: [winPath("DiscordCanary")],
        darwin: ["/Applications/Discord Canary.app/Contents"],
        linux: ["/usr/share/discord-canary", "/usr/lib64/discord-canary", "/opt/discord-canary", "/opt/DiscordCanary", `${FLATPAK_DIR}.DiscordCanary/current/active/files/discord-canary`, `${HOME_FLATPAK_DIR}.DiscordCanary/current/active/files/discord-canary`, `${HOME_DIR}/.local/bin/DiscordCanary`]
    },
    development: {
        win32: [winPath("DiscordDevelopment")],
        darwin: ["/Applications/Discord Development.app/Contents"],
        linux: ["/usr/share/discord-development", "/usr/lib64/discord-development", "/opt/discord-development", "/opt/DiscordDevelopment", `${HOME_DIR}/.local/bin/DiscordDevelopment`]
    }
};

const SEARCH_FUNCTIONS = {
    win32: (dir: string) => {
        if (!existsSync(dir)) return undefined;
        const discordDirectory = readdirSync(dir);
        const currentBuild = discordDirectory.filter((x) => x.startsWith("app-")).reverse()[0];
        dir = join(dir, currentBuild);
        return existsSync(dir) ? dir : undefined;
    },
    darwin: (dir: string) => {
        return existsSync(dir) ? dir : undefined;
    },
    linux: (dir: string) => {
        return existsSync(dir) ? dir : undefined;
    }
};

const APPEND_PATH_FUNCTIONS = {
    win32: (dir: string) => join(dir, "Resources", "app.asar"),
    darwin: (dir: string) => dir,
    linux: (dir: string) => join(dir, "resources", "app.asar")
};

function winPath(dir: string) {
    return join(process.env.LOCALAPPDATA || "", dir);
}

export function getDir(distType: string) {
    for (const dir of SEARCH_DIRECTORIES[distType][process.platform]) {
        const result = SEARCH_FUNCTIONS[process.platform](dir);
        if (result) return result;
    }
    return undefined;
}
export function getAsar(distType: string) {
    let dir = module.exports.getDir(distType);
    if (!dir) return undefined;
    dir = APPEND_PATH_FUNCTIONS[process.platform](dir);
    return existsSync(dir) ? dir : undefined;
}
