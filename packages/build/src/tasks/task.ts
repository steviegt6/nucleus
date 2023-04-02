import BuildTask from "./buildTask";
import PackTask from "./packTask";
import CopyTask from "./copyTask";
import RunTask from "./runTask";
import DevTask from "./devTask";
import BuildCITask from "./ci/buildCiTask";

export default interface Task {
    readonly name: string;

    run(): Promise<void>;
}

export const TASKS: Task[] = [new BuildTask(), new PackTask(), new CopyTask(), new RunTask(), new DevTask(), new BuildCITask()];

export async function execTask(task: Task) {
    await task.run();
}
