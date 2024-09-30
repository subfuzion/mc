export const LogLevels = [
  /** Verbose diagnostic logging */
  "debug",
  /** Basic diagnostic logging / tracing */
  "log",
  /** Status information */
  "info",
  /** Warning information */
  "warn",
  /** Error information */
  "error",
  /** No output */
  "silent",
] as const;

export type LogLevel = (typeof LogLevels)[number];

export interface Logger {
  print(str: Uint8Array | string): void;
  printf(fmt: string, ...params: unknown[]): void;
  println(...params: unknown[]): void;
  clear(): void;
  debug(message?: unknown, ...rest: unknown[]): void;
  log(message?: unknown, ...rest: unknown[]): void;
  info(message?: unknown, ...rest: unknown[]): void;
  warn(message?: string, ...rest: unknown[]): void;
  error(message?: string, ...rest: unknown[]): void;
  ok(...params: unknown[]): void;
  pass(...params: unknown[]): void;
  fail(...params: unknown[]): void;
}
