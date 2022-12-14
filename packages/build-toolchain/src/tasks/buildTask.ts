import { execSync } from "child_process";
import Task from "./task";

export default class BuildTask implements Task {
    name: string = "build";

    async run(): Promise<void> {
        console.log("Building with tsc...");
        execSync("tsc -p ./packages/discord/tsconfig.json");
    }
}
