export function getArgBool(arg: string): boolean {
    return process.argv.includes(arg);
}

export function getStringArg(arg: string): string | undefined {
    const index = process.argv.indexOf(arg);
    if (index === -1) return undefined;
    return process.argv[index + 1];
}
