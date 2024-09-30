import { format } from "node:util";
import { type Logger, type LogLevel, LogLevels } from "@/cli/log.ts";

export class MockLogger implements Logger {
  logLevel: LogLevel;
  #stdout = "";
  #stderr = "";

  constructor(logLevel: LogLevel = "info") {
    this.logLevel = logLevel;
  }

  shouldLog(logLevel: LogLevel): boolean {
    return LogLevels.indexOf(logLevel) >= LogLevels.indexOf(this.logLevel);
  }

  get stdout(): string {
    return this.#stdout;
  }

  set stdout(str: Uint8Array | string) {
    this.#stdout = str.toString();
  }

  get stderr(): string {
    return this.#stderr;
  }

  set stderr(str: Uint8Array | string) {
    this.#stderr = str.toString();
  }

  print(str: Uint8Array | string): void {
    this.stdout += str.toString();
  }

  printf(fmt: string, ...params: unknown[]): void {
    this.stdout += format(fmt, ...params);
  }

  println(...params: unknown[]): void {
    if (params.length > 0) {
      this.stdout += `${params.join(" ")}\n`;
    } else {
      this.stdout += "\n";
    }
  }

  printerrln(message?: string, ...rest: unknown[]): void {
    if (rest.length > 0) {
      this.stderr += `${message} ${rest.join(" ")}\n`;
    } else {
      this.stderr += `${message}\n`;
    }
  }

  clear(): void {
    this.stdout = "";
    this.stderr = "";
  }

  debug(message?: unknown, ...rest: unknown[]): void {
    this.shouldLog("debug") && this.log(message, ...rest);
  }

  log(message?: unknown, ...rest: unknown[]): void {
    this.shouldLog("log") && this.println(message, ...rest);
  }

  info(message?: unknown, ...rest: unknown[]): void {
    this.shouldLog("info") && this.log(`INFO: ${message}`, ...rest);
  }

  warn(message?: string, ...rest: unknown[]): void {
    this.shouldLog("warn") && this.log(`WARN: ${message}`, ...rest);
  }

  error(message?: string, ...rest: unknown[]): void {
    if (this.shouldLog("error")) {
      this.printerrln(`ERROR: ${message}`, ...rest);
    }
  }

  ok(...params: unknown[]): void {
    const sep = params.length ? ":" : "";
    this.println(`OK${sep}`, ...params);
  }

  pass(...params: unknown[]): void {
    const sep = params.length ? ":" : "";
    this.println(`PASS${sep}`, ...params);
  }

  fail(...params: unknown[]): void {
    const sep = params.length ? ":" : "";
    this.println(`FAIL:${sep}`, ...params);
  }
}
