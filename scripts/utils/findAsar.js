// Paths and some resolution logic taken from https://github.com/replugged-org/replugged/blob/main/injectors/

const { execSync } = require("child_process");
const { existsSync, readdirSync } = require("fs");
const { join } = require("path");

// eslint-disable-next-line quotes
const homedir = process.platform === "linux" ? execSync('grep $(logname) /etc/passwd | cut -d ":" -f6').toString().trim() : "";
const FLATPAK_DIR = "/var/lib/flatpak/app/com.discordapp";
const HOME_FLATPAK_DIR = `${homedir}/.local/share/flatpak/app/com.discordapp`;

const SEARCH_DIRECTORIES = {
    stable: {
        win32: [winPath("Discord")],
        darwin: ["/Applications/Discord.app/Contents"],
        linux: ["/usr/share/discord", "/usr/lib64/discord", "/opt/discord", "/opt/Discord", `${FLATPAK_DIR}.Discord/current/active/files/discord`, `${HOME_FLATPAK_DIR}.Discord/current/active/files/discord`, `${homedir}/.local/bin/Discord`]
    },
    ptb: {
        win32: [winPath("DiscordPTB")],
        darwin: ["/Applications/Discord PTB.app/Contents"],
        linux: ["/usr/share/discord-ptb", "/usr/lib64/discord-ptb", "/opt/discord-ptb", "/opt/DiscordPTB", `${homedir}/.local/bin/DiscordPTB`]
    },
    canary: {
        win32: [winPath("DiscordCanary")],
        darwin: ["/Applications/Discord Canary.app/Contents"],
        linux: ["/usr/share/discord-canary", "/usr/lib64/discord-canary", "/opt/discord-canary", "/opt/DiscordCanary", `${FLATPAK_DIR}.DiscordCanary/current/active/files/discord-canary`, `${HOME_FLATPAK_DIR}.DiscordCanary/current/active/files/discord-canary`, `${homedir}/.local/bin/DiscordCanary`]
    },
    dev: {
        win32: [winPath("DiscordDevelopment")],
        darwin: ["/Applications/Discord Development.app/Contents"],
        linux: ["/usr/share/discord-development", "/usr/lib64/discord-development", "/opt/discord-development", "/opt/DiscordDevelopment", `${homedir}/.local/bin/DiscordDevelopment`]
    }
};

const SEARCH_FUNCTIONS = {
    win32: (dir) => {
        if (!existsSync(dir)) return undefined;
        const discordDirectory = readdirSync(dir);
        const currentBuild = discordDirectory.filter((x) => x.startsWith("app-")).reverse()[0];
        dir = join(dir, currentBuild);
        return existsSync(dir) ? dir : undefined;
    },
    darwin: (dir) => {
        return existsSync(dir) ? dir : undefined;
    },
    linux: (dir) => {
        return existsSync(dir) ? dir : undefined;
    }
};

const APPEND_PATH_FUNCTIONS = {
    win32: (dir) => join(dir, "Resources", "app.asar"),
    darwin: (dir) => dir,
    linux: (dir) => join(dir, "resources", "app.asar")
};

function winPath(dir) {
    return join(process.env.LOCALAPPDATA, dir);
}

module.exports.getDir = (distType) => {
    for (const dir of SEARCH_DIRECTORIES[distType][process.platform]) {
        const result = SEARCH_FUNCTIONS[process.platform](dir);
        if (result) return result;
    }
    return undefined;
};

module.exports.getAsar = (distType) => {
    let dir = module.exports.getDir(distType);
    if (!dir) return undefined;
    dir = APPEND_PATH_FUNCTIONS[process.platform](dir);
    return existsSync(dir) ? dir : undefined;
};
