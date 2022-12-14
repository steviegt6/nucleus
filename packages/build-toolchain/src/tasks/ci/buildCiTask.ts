import BuildTask from "../buildTask";
import PackTask from "../packTask";
import Task, { execTask } from "../task";

export default class BuildCITask implements Task {
    name: string = "build-ci";

    async run(): Promise<void> {
        // Build the project.
        await execTask(new BuildTask());

        // Build without vibe.
        await execTask(new PackTask());

        // Build with vibe.
        process.argv.push("--include-vibe");
        await execTask(new PackTask());
    }
}
