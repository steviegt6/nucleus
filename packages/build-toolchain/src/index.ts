import prompts from "prompts";
import { execTask, TASKS } from "./tasks/task";

(async () => {
    console.log("nucleus Build Toolchain");
    console.log("Process arguments: " + process.argv);

    const taskName = process.argv[2] || (await promptTask());
    const task = getTask(taskName);
    if (!task) {
        console.error("Invalid task specified: " + taskName);
        process.exit(1);
    }

    console.log("Running task: " + task.name);
    await execTask(task);
})();

function getTask(taskName: string) {
    return TASKS.find((task) => task.name === taskName);
}

async function promptTask() {
    return (
        await prompts({
            type: "select",
            name: "task",
            message: "No task specified - please select a task to run",
            choices: TASKS.map((task) => ({ title: task.name, value: task.name }))
        })
    ).task;
}
