import { format } from "node:util";

import { type Logger, type LogLevel, LogLevels } from "./log.ts";
import process from "node:process";

// export type StdinType = NodeJS.ReadStream & {fd: 0};
export type StdinType = NodeJS.ReadStream;
// export type StdoutType = NodeJS.WriteStream & {fd: 1};
export type StdoutType = NodeJS.WriteStream;
// export type StderrType = NodeJS.WriteStream & {fd: 2};
export type StderrType = NodeJS.WriteStream;

const DefaultConsole = console;
const DefaultStdin: StdinType = process.stdin;
const DefaultStdout: StdoutType = process.stdout;
const DefaultStderr: StderrType = process.stderr;

class Prefix {
  static readonly info: [string, string] = ["     |", "[ info ]"];
  static readonly warn: [string, string] = [" wrn |", "[ warn ]"];
  static readonly error: [string, string] = [" err |", "[ ERR! ]"];
  static readonly ok: [string, string] = [" ok  |", "[ ok   ]"];
  static readonly pass: [string, string] = [" 🟢  |", "[ pass ]"];
  static readonly fail: [string, string] = [" 🔴  |", "[ FAIL ]"];
  static readonly abort: [string, string] = [" 🚫  |", "[ ABRT ]"];

  static get(prefix: [string, string]): string {
    return process.stdout.isTTY ? prefix[0] : prefix[1];
  }
}

export class IO implements Logger {
  logLevel: LogLevel;
  readonly #console: Console;
  readonly #stdin: StdinType;
  readonly #stdout: StdoutType;
  readonly #stderr: StderrType;

  constructor(
    logLevel: LogLevel = "info",
    console: Console = DefaultConsole,
    stdin: StdinType = DefaultStdin,
    stdout: StdoutType = DefaultStdout,
    stderr: StderrType = DefaultStderr,
  ) {
    this.logLevel = logLevel;
    this.#console = console;
    this.#stdin = stdin;
    this.#stdout = stdout;
    this.#stderr = stderr;
  }

  toString(): string {
    return `{
      logLevel: ${this.logLevel},
    }`;
  }

  shouldLog(logLevel: LogLevel): boolean {
    return LogLevels.indexOf(logLevel) >= LogLevels.indexOf(this.logLevel);
  }

  get console(): Console {
    return this.#console;
  }

  get stdin(): StdinType {
    return this.#stdin;
  }

  get stdout(): StdoutType {
    return this.#stdout;
  }

  get stderr(): StderrType {
    return this.#stderr;
  }

  clear(): void {
    this.console.clear();
  }

  /**
   * Prints str to stdout (regardless of log level).
   */
  print(str: Uint8Array | string): void {
    this.stdout.write(str);
  }

  /**
   * Prints format str to stdout (regardless of log level).
   */
  printf(fmt: string, ...params: unknown[]): void {
    this.print(format(fmt, ...params));
  }

  /**
   * Prints message to stdout with a newline (regardless of log level).
   */
  println(...params: unknown[]): void {
    const str = params.length > 0 ? params.map((p) => String(p)).join(" ") : "";
    this.print(`${str}\n`);
  }

  debug(message: unknown, ...params: unknown[]): void {
    this.shouldLog("debug") && this.console.debug(message, ...params);
  }

  log(message: unknown, ...params: unknown[]): void {
    this.shouldLog("log") && this.console.log(message, ...params);
  }

  info(message: unknown, ...params: unknown[]): void {
    this.shouldLog("info") &&
      this.console.info(`${Prefix.get(Prefix.info)} ${message}`, ...params);
  }

  warn(message: unknown, ...params: unknown[]): void {
    this.shouldLog("warn") &&
      this.console.warn(`${Prefix.get(Prefix.warn)} ${message}`, ...params);
  }

  error(message: unknown, ...params: unknown[]): void {
    this.shouldLog("error") &&
      this.console.error(`${Prefix.get(Prefix.error)} ${message}`, ...params);
  }

  ok(...params: unknown[]): void {
    this.println(Prefix.get(Prefix.ok), ...params);
  }

  pass(...params: unknown[]): void {
    this.println(Prefix.get(Prefix.pass), ...params);
  }

  fail(...params: unknown[]): void {
    this.println(Prefix.get(Prefix.fail), ...params);
  }

  static defaultIO(logLevel?: LogLevel): IO {
    return new IO(logLevel);
  }

  /**
   * Will print regardless of loglevel.
   */
  static printf(fmt: string, ...params: unknown[]): void {
    new IO().printf(fmt, ...params);
  }

  /**
   * Will print regardless of loglevel.
   */
  static abort(reason: unknown) {
    // Standardize format and shorten error output.
    let m = reason instanceof Error ? reason.message : String(reason);
    m = m.split("\n")[0].split(".")[0];
    m = m[0].toLowerCase() + m.slice(1);
    console.error(Prefix.get(Prefix.abort), m);
  }
}
