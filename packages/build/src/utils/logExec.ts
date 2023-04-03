import { execSync } from "child_process";

export default function logExecSync(cmd: string): void {
    try {
        const buf = execSync(cmd);
        console.log(buf.toString());
    } catch (e) {
        console.error(e.output[1].toString());
    }
}
