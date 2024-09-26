import {statSync} from 'node:fs';
import {normalize, parse, resolve} from 'node:path';

import {Args, type ParsedArgs} from './args.ts';
import type {Config} from './config.ts';
import {IO} from './io.ts';

class ParsedPath {
  original: string;
  normalized: string;
  isDirectory: boolean;
  full: string;
  dir: string;
  base: string;
  name: string;
  ext: string;

  constructor(original?: string) {
    this.original = original || '.';
    this.normalized = normalize(this.original);
    const p = this.normalized;
    this.isDirectory = isDirectory(p);
    this.full = resolve(p);
    const {dir, base, name, ext} = parse(p);
    this.dir = normalize(dir);
    this.base = base;
    this.name = name;
    this.ext = ext;
  }
}

export class Context {
  config: Config;

  io = IO.defaultIO();

  execPath: string;
  main: string;
  args: string[];
  parsedArgs: ParsedArgs;

  samplePath: ParsedPath;

  constructor(argv: string[], config: Config, io: IO) {
    this.config = config;
    this.io = io;

    // command line
    this.execPath = argv[0];
    this.main = argv[1];
    this.args = argv.slice(2);

    // parsed command line
    const args = new Args();
    this.parsedArgs = args.parse(this.args);

    // sample path
    this.samplePath = new ParsedPath(args.samplePath);

    // log level
    this.io.logLevel = args.logLevel;
  }

  toString(): string {
    return `{
      io: ${this.io.toString()}
    }`;
  }
}

function isDirectory(path: string): boolean {
  try {
    const stats = statSync(path);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
}
