import BuildTask from "../buildTask";
import PackTask from "../packTask";
import Task, { execTask } from "../task";

export default class BuildCITask implements Task {
    name: string = "build-ci";

    async run(): Promise<void> {
        // Build the project.
        await execTask(new BuildTask());

        // Pack.
        await execTask(new PackTask());
    }
}
