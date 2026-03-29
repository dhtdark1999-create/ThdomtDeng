import { c as isReleaseType, i as versionBump, l as symbols, r as loadBumpConfig, s as ProgressEvent, t as bumpConfigDefaults } from "./config-C4d1xESV.mjs";
import process from "node:process";
import { styleText } from "node:util";
import { NonZeroExitError, x } from "tinyexec";
import { valid } from "semver";
import cac from "cac";
//#region src/cli/exit-code.ts
/**
* CLI exit codes.
*
* @see https://nodejs.org/api/process.html#process_exit_codes
*/
let ExitCode = /* @__PURE__ */ function(ExitCode) {
	ExitCode[ExitCode["Success"] = 0] = "Success";
	ExitCode[ExitCode["FatalError"] = 1] = "FatalError";
	ExitCode[ExitCode["InvalidArgument"] = 9] = "InvalidArgument";
	return ExitCode;
}({});
//#endregion
//#region package.json
var version = "11.0.1";
//#endregion
//#region src/cli/parse-args.ts
/**
* Parses the command-line arguments
*/
async function parseArgs() {
	try {
		const { args, resultArgs } = loadCliArgs();
		const parsedArgs = {
			help: args.help,
			version: args.version,
			quiet: args.quiet,
			options: await loadBumpConfig({
				preid: args.preid,
				commit: args.commit,
				tag: args.tag,
				sign: args.sign,
				push: args.push,
				all: args.all,
				noGitCheck: args.gitCheck === void 0 ? void 0 : !args.gitCheck,
				confirm: args.yes === void 0 ? void 0 : !args.yes,
				noVerify: args.verify === void 0 ? void 0 : !args.verify,
				install: args.install,
				files: [...args["--"] || [], ...resultArgs],
				ignoreScripts: args.ignoreScripts,
				currentVersion: args.currentVersion,
				execute: args.execute,
				printCommits: args.printCommits,
				recursive: args.recursive,
				release: args.release,
				configFilePath: args.configFilePath
			})
		};
		if (parsedArgs.options.files && parsedArgs.options.files.length > 0) {
			const firstArg = parsedArgs.options.files[0];
			if (firstArg === "prompt" || isReleaseType(firstArg) || valid(firstArg)) {
				parsedArgs.options.release = firstArg;
				parsedArgs.options.files.shift();
			}
		}
		if (parsedArgs.options.recursive && parsedArgs.options.files?.length) console.log(styleText("yellow", "The --recursive option is ignored when files are specified"));
		return parsedArgs;
	} catch (error) {
		return errorHandler$1(error);
	}
}
function loadCliArgs(argv = process.argv) {
	const cli = cac("bumpp");
	cli.version(version).usage("[...files]").option("--preid <preid>", "ID for prerelease").option("-a, --all", `Include all files (default: ${bumpConfigDefaults.all})`).option("--git-check", `Run git check (default: ${!bumpConfigDefaults.noGitCheck})`).option("-c, --commit [msg]", `Commit message (default: ${bumpConfigDefaults.commit})`).option("-t, --tag [tag]", `Tag name (default: ${bumpConfigDefaults.tag})`).option("--sign", "Sign commit and tag").option("--install", `Run 'npm install' after bumping version (default: ${bumpConfigDefaults.install})`).option("-p, --push", `Push to remote (default: ${bumpConfigDefaults.push})`).option("-y, --yes", `Skip confirmation (default: ${!bumpConfigDefaults.confirm})`).option("-r, --recursive", `Bump package.json files recursively (default: ${bumpConfigDefaults.recursive})`).option("--verify", `Run git verification (default: ${!bumpConfigDefaults.noVerify})`).option("--ignore-scripts", `Ignore scripts (default: ${bumpConfigDefaults.ignoreScripts})`).option("-q, --quiet", "Quiet mode").option("--current-version <version>", "Current version").option("--print-commits", "Print recent commits").option("-x, --execute <command>", "Commands to execute after version bumps").option("--release <release>", `Release type or version number (e.g. 'major', 'minor', 'patch', 'prerelease', etc. default: ${bumpConfigDefaults.release})`).option("--configFilePath <configFilePath>", `Path to custom build.config file`).help();
	const result = cli.parse(argv);
	return {
		args: result.options,
		resultArgs: result.args
	};
}
function errorHandler$1(error) {
	console.error(error.message);
	return process.exit(ExitCode.InvalidArgument);
}
//#endregion
//#region src/cli/index.ts
/**
* The main entry point of the CLI
*/
async function main() {
	try {
		process.on("uncaughtException", errorHandler);
		process.on("unhandledRejection", errorHandler);
		const { help, version, quiet, options } = await parseArgs();
		if (help || version) process.exit(ExitCode.Success);
		else {
			if (!options.all && !options.noGitCheck) await checkGitStatus();
			if (!quiet) options.progress = options.progress ? options.progress : progress;
			await versionBump(options);
		}
	} catch (error) {
		errorHandler(error);
	}
}
async function checkGitStatus() {
	const { stdout } = await x("git", ["status", "--porcelain"]);
	if (stdout.trim()) throw new Error(`Git working tree is not clean:\n${stdout}`);
}
function progress({ event, script, updatedFiles, skippedFiles, newVersion }) {
	switch (event) {
		case ProgressEvent.FileUpdated:
			console.log(symbols.success, `Updated ${updatedFiles.pop()} to ${newVersion}`);
			break;
		case ProgressEvent.FileSkipped:
			console.log(symbols.info, `${skippedFiles.pop()} did not need to be updated`);
			break;
		case ProgressEvent.GitCommit:
			console.log(symbols.success, "Git commit");
			break;
		case ProgressEvent.GitTag:
			console.log(symbols.success, "Git tag");
			break;
		case ProgressEvent.GitPush:
			console.log(symbols.success, "Git push");
			break;
		case ProgressEvent.NpmScript:
			console.log(symbols.success, `Npm run ${script}`);
			break;
	}
}
function errorHandler(error) {
	let message = error.message || String(error);
	if (error instanceof NonZeroExitError) message += `\n\n${error.output?.stderr || ""}`;
	if (process.env.DEBUG || process.env.NODE_ENV === "development") message += `\n\n${error.stack || ""}`;
	console.error(message);
	process.exit(ExitCode.FatalError);
}
//#endregion
export { checkGitStatus, main };
