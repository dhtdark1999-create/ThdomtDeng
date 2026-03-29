//#region src/cli/index.d.ts
/**
 * The main entry point of the CLI
 */
declare function main(): Promise<void>;
declare function checkGitStatus(): Promise<void>;
//#endregion
export { checkGitStatus, main };