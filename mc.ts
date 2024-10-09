#!/usr/bin/env deno run -A 

import { argv } from "node:process";

import { Cli } from "@/cli/cli.ts";
import { IO } from "@/cli/io.ts";
import process from "node:process";

try {
  await Cli.run(argv);
} catch (err) {
  // All exceptions during CLI initialization surface here.
  // console.error(err);
  IO.abort(err);
  process.exitCode = 1;
}
