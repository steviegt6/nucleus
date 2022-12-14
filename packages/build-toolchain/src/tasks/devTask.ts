import BuildTask from "./buildTask";
import CopyTask from "./copyTask";
import PackTask from "./packTask";
import RunTask from "./runTask";
import Task from "./task";

export default class DevTask implements Task {
    name: string = "dev";

    async run(): Promise<void> {
        await execTask(new BuildTask());
        await execTask(new PackTask());
        await execTask(new CopyTask());
        await execTask(new RunTask());
    }
}

async function execTask(task: Task) {
    await task.run();
}
