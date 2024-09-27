#!/usr/bin/env node --experimental-strip-types --disable-warning=ExperimentalWarning
import {argv} from 'node:process';

import {Cli} from '#lib/cli/cli.ts';
import {IO} from '#lib/cli/io.ts';

try {
  await Cli.run(argv);
} catch (err) {
  // All exceptions during CLI initialization surface here.
  IO.abort(err);
  process.exitCode = 1;
}
