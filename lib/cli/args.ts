import { accessSync, constants } from "node:fs";
import { inspect, parseArgs, ParseArgsConfig } from "node:util";
import { normalize, parse, resolve } from "node:path";
import { statSync } from "node:fs";

import { type LogLevel, LogLevels } from "@/cli/log.ts";

interface KeyValues {
  [key: string]:
    | string
    | boolean
    | number
    | (string | boolean | number)[]
    | any;
}

export class ParsedPath {
  original: string;
  normalized: string;
  isDirectory: boolean;
  full: string;
  dir: string;
  base: string;
  name: string;
  ext: string;

  constructor(original?: string) {
    this.original = original || ".";
    this.normalized = normalize(this.original);
    const p = this.normalized;
    this.isDirectory = isDirectory(p);
    this.full = resolve(p);
    const { dir, base, name, ext } = parse(p);
    this.dir = normalize(dir);
    this.base = base;
    this.name = name;
    this.ext = ext;
  }
}

class Options {
  help = false;
  version = false;
  logLevel: LogLevel = "info";
}

class Positionals {
  // This WILL be initialized when Args is instantiated
  // or an exception will be raised.
  samplePath!: ParsedPath;
  extra: string[] = [];
}

class ParsedArgsResult {
  values: KeyValues = {};
  positionals: any;
  toString(): string {
    return `{
      values: ${inspect(this.values)},
      positionals: ${inspect(this.positionals)},
    }`;
  }
}

/**
 * Args parses, validates, and transforms command line arguments to typed values
 * used by the mc command.
 */
export class Args {
  original: string[];
  optionsSpec: KeyValues;
  options = new Options();
  positionals = new Positionals();

  constructor(args: string[]) {
    this.original = args;

    this.optionsSpec = {
      help: {
        type: "boolean",
        short: "h",
        default: false,
        description: "print usage information",
      },
      loglevel: {
        type: "string",
        default: "info",
        description:
          "increase output: silent | error | warn | info * | log | debug",
      },
      version: {
        type: "boolean",
        short: "v",
        default: false,
        description: "print current version",
      },
    };

    this.parse();
  }

  parse(): void {
    const parsed = parseArgs({
      options: this.optionsSpec,
      args: this.original,
      allowPositionals: true,
      strict: true,
    } as ParseArgsConfig);

    const parsedArgs = new ParsedArgsResult();
    const values = Object.fromEntries(Object.entries(parsed.values));
    parsedArgs.values = values;
    const positionals = parsed.positionals;
    parsedArgs.positionals = positionals;

    this.options.help = values.help as boolean;
    this.options.version = values.version as boolean;
    this.options.logLevel = values.loglevel as LogLevel;
    this.positionals.samplePath = new ParsedPath(positionals[0]);
    this.positionals.extra = positionals.slice(1);

    this.validate();
  }

  validate(): void {
    const { logLevel } = this.options;
    const { samplePath } = this.positionals;

    if (!LogLevels.includes(logLevel)) {
      throw new Error(`bad loglevel: ${logLevel}`);
    }
    if (this.positionals.extra.length > 0) {
      throw new Error(
        `too many arguments (expected only one): ${this.positionals.extra}`,
      );
    }
    if (!isAccessible(samplePath.normalized)) {
      throw new Error(
        `can't access path "${samplePath.normalized}"`,
      );
    }
  }
}

/**
 * Checks if path is accessible for the specified mode (default is read access).
 * @param path - File or directory path.
 * @param mode - F_OK, R_OK, W_OK, or X_OK.
 *               See: https://nodejs.org/api/fs.html#file-access-constants
 */
function isAccessible(path: string, mode: number = constants.R_OK): boolean {
  try {
    accessSync(path, mode);
    return true;
  } catch {
    return false;
  }
}

function isDirectory(path: string): boolean {
  try {
    const stats = statSync(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}
