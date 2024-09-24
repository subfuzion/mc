export const LogLevels = [
  /** Verbose diagnostic logging */
  'debug',
  /** Basic diagnostic logging / tracing */
  'log',
  /** Status information */
  'info',
  /** Warning information */
  'warn',
  /** Error information */
  'error',
  /** No output */
  'silent',
] as const;

export type LogLevel = (typeof LogLevels)[number];

export interface Logger {
  print(str: Uint8Array | string): void;
  printf(fmt: string, ...params: any[]): void;
  println(...params: any[]): void;
  clear(): void;
  debug(message?: any, ...rest: any[]): void;
  log(message?: any, ...rest: any[]): void;
  info(message?: any, ...rest: any[]): void;
  warn(message?: string, ...rest: any[]): void;
  error(message?: string, ...rest: any[]): void;
  ok(...params: any[]): void;
  pass(...params: any[]): void;
  fail(...params: any[]): void;
}
