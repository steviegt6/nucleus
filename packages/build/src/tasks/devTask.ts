import { getDiscordChannel } from "../utils/commonPrompts";
import BuildTask from "./buildTask";
import CopyTask from "./copyTask";
import PackTask from "./packTask";
import RunTask from "./runTask";
import Task, { execTask } from "./task";

export default class DevTask implements Task {
    name: string = "dev";

    async run(): Promise<void> {
        // Get channel early so it doesn't prompt later.
        await getDiscordChannel();

        await execTask(new BuildTask());
        await execTask(new PackTask());
        await execTask(new CopyTask());
        await execTask(new RunTask());
    }
}
