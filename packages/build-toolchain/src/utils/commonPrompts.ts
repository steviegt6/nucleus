import prompts from "prompts";
import { getStringArg } from "./parseArgs";

const DISCORD_CHANNELS = ["stable", "ptb", "canary", "development"];
const DEFAULT_CHANNEL = "canary";

export async function getDiscordChannel(): Promise<string> {
    var discordChannel = getStringArg("--channel") || (await promptDiscordChannel());
    if (!discordChannel || !DISCORD_CHANNELS.includes(discordChannel)) {
        console.log("Invalid Discord channel provided: " + discordChannel);
        console.log("Defaulting to: " + DEFAULT_CHANNEL);
        discordChannel = DEFAULT_CHANNEL;
    }

    return discordChannel;
}

export async function promptDiscordChannel(): Promise<string> {
    return (
        await prompts({
            type: "select",
            name: "channel",
            message: "Discord channel",
            choices: DISCORD_CHANNELS.map((channel) => ({ title: channel, value: channel }))
        })
    ).channel;
}
