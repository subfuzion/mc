import { Args, ParsedPath } from "@/cli/args.ts";
import type { Config } from "./config.ts";
import { IO } from "@/cli/io.ts";

export class Context {
  io = IO.defaultIO();

  config: Config;

  execPath: string;
  main: string;
  args: Args;

  samplePath: ParsedPath;

  constructor(argv: string[], config: Config, io: IO) {
    this.config = config;
    this.io = io;

    // command line
    this.execPath = argv[0];
    this.main = argv[1];

    // parse and surface up for convenience
    // Args can throw, but we let initialization errors get handled by bin/main.ts
    this.args = new Args(argv.slice(2));
    this.io.logLevel = this.args.options.logLevel;
    this.samplePath = this.args.positionals.samplePath;
  }

  toString(): string {
    return `{
      config: config,
      io: ${this.io.toString()}
    }`;
  }
}
