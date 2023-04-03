import logExecSync from "../utils/logExec";
import Task from "./task";

export default class BuildTask implements Task {
    name: string = "build";

    async run(): Promise<void> {
        console.log("Building with tsc...");
        logExecSync("tsc -p ./packages/bootstrapper/tsconfig.json");
    }
}
