import {inspect, parseArgs} from 'node:util';
import type {LogLevel} from './log.ts';

interface KeyValues {
  [key: string]: string | boolean | number | (string | boolean | number)[];
}

export class ParsedArgs {
  options: any;
  values: KeyValues;
  positionals: string[];
  toString(): string {
    return `{
      values: ${inspect(this.values)},
      positionals: ${inspect(this.positionals)},
    }`;
  }
}

export class Args {
  options: any;
  parsedArgs: ParsedArgs;
  samplePath: string;
  logLevel: LogLevel;

  constructor() {
    this.options = {
      help: {
        type: 'boolean',
        short: 'h',
        description: 'Print usage information',
      },
      loglevel: {
        type: 'string',
        default: 'info',
        description: 'Print: debug | log | info * | warn | error | silent',
      },
      version: {
        type: 'boolean',
        short: 'v',
        description: 'Print current version',
      },
    };
  }

  parse(args: string[]): ParsedArgs {
    const options = this.options;
    const parsed = parseArgs({
      options,
      args,
      allowPositionals: true,
      strict: true,
    });

    const parsedArgs = new ParsedArgs();
    this.parsedArgs = parsedArgs;
    const values = Object.fromEntries(Object.entries(parsed.values));
    parsedArgs.values = values;
    const positionals = parsed.positionals;
    parsedArgs.positionals = positionals;
    parsedArgs.options = options;

    this.logLevel = values.loglevel as LogLevel;
    this.samplePath = positionals[0];

    return parsedArgs;
  }
}
