import { type ChildProcess, spawn, spawnSync } from "node:child_process";
import { Buffer } from "node:buffer";

export const DefaultCommand = "deno";

export class ExecCommandSpec {
  cmd!: string;
  args?: string[];
  options?: ExecCommandOptions;
  cb?: ExecCommandCallback;
}

export interface ExecCommandOptions {
  cwd?: string | URL;
  env?: Record<string, string>;
  argv0?: string;
  stdio?: Buffer | string;
  detached?: boolean;
  uid?: number;
  gid?: number;
  serialization?: string;
  shell?: boolean | string;
  windowsVerbatimArguments?: boolean;
  windowsHide?: boolean;
  signal?: AbortSignal;
  timeout?: number;
  killSignal?: string | number;
}

export interface ExecCommandResult {
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  error?: unknown;
}

export type ExecCommandCallback = (result: ExecCommandResult) => void;

/**
 * Spawns child process. Does not throw. This function can be used to either
 * return an ExecCommandResult synchronously or to return the child process (or
 * null if exec failure) and asynchronously call a callback with an
 * ExecCommandResult.
 */
export function execCommandSpec(
  spec: ExecCommandSpec,
): ExecCommandResult | ChildProcess | undefined {
  return exec(
    spec.cmd,
    spec.args,
    spec.options,
    spec.cb,
  );
}

// TODO: port to Deno (https://docs.deno.com/runtime/tutorials/subprocess/)
export function exec(
  cmd: string,
  args?: string[],
  options?: ExecCommandOptions,
  cb?: ExecCommandCallback,
): ExecCommandResult | ChildProcess | undefined {
  let command = cmd;
  if (Array.isArray(args) && args?.length > 0) {
    command += ` ${args.join(" ").trim()}`;
  }

  let resultObject: ExecCommandResult;

  // Check if cmd exists before attempting to spawn it. This is because node
  // will hang until the timeout expires on an ENOENT. Setting `detached: true`
  // as an option doesn't help.
  const result = spawnSync("which", [cmd]);
  if (result.status !== 0) {
    resultObject = {
      error: new Error(`${cmd}: command not found`),
      command: command,
      exitCode: -1,
      stdout: "",
      stderr: "",
    };
    if (cb) {
      cb(resultObject);
      return undefined;
    }
    return resultObject;
  }

  if (cb) {
    let stdout = "";
    let stderr = "";
    // @ts-ignore todo
    const child = spawn(cmd, args, options) as ChildProcessWithoutNullStreams;
    try {
      child.once("error", (err: Error) => {
        resultObject = {
          error: err,
          command: command,
          exitCode: -1,
          stdout: "",
          stderr: "",
        };
        child.removeAllListeners();
        child.stdin.end();
        child.stdout.destroy();
        child.stderr.destroy();
        child.kill();
        cb(resultObject);
      });
      child.once("close", (code: number) => {
        resultObject = {
          error: undefined,
          command: command,
          exitCode: code,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
        };
        cb(resultObject);
      });
      child.stdout.on("data", (data: Buffer) => {
        stdout += data.toString();
      });
      child.stderr.on("data", (data: Buffer) => {
        stderr += data.toString();
      });
    } catch (err) {
      // Shouldn't get here since there's an 'error' listener, but just in case.
      resultObject = {
        error: err,
        command: command,
        exitCode: -1,
        stdout: "",
        stderr: "",
      };
      cb(resultObject);
    }
    return child;
  }
  /* no callback */
  try {
    // @ts-ignore todo
    const result = spawnSync(cmd, args, options);
    resultObject = {
      error: undefined,
      command: command,
      exitCode: result.status,
      stdout: result.stdout.toString().trim(),
      stderr: result.stderr.toString().trim(),
    };
  } catch (err) {
    resultObject = {
      error: err,
      command: command,
      exitCode: -1,
      stdout: "",
      stderr: "",
    };
  }
  return resultObject;
}
