import { inspect } from "node:util";
import { stdout } from "node:process";

import { PlanBuilderFactory, PlanBuilderType } from "@/plan/builder.ts";
import { Config } from "@/cli/config.ts";
import { Context } from "@/cli/context.ts";
import { IO } from "@/cli/io.ts";

export class Cli {
  context: Context;

  constructor(argv: string[]) {
    const config = Config.load();
    this.context = new Context(argv, config, IO.defaultIO());
  }

  async run() {
    if (this.context.args.options.help) {
      return this.printUsage();
    }
    if (this.context.args.options.version) {
      return this.printVersion();
    }
    this.context.io.debug(inspect(this, false, 100));

    const plan = await PlanBuilderFactory.builder(
      PlanBuilderType.SampleSuiteBuilder,
    ).build(this.context);
    const results = await plan.run();
    this.context.io.log(inspect(results, false, 100));
  }

  printUsage(): void {
    if (!stdout.isTTY) return;

    const { description, name, version } = this.context.config;
    const options = this.context.args.optionsSpec;

    const usage = `${name} ${version} - ${description} 
   
USAGE:
  ${name} [FLAGS] [PATHNAME]

  PATHNAME           path to a program or directory ('.')

FLAGS:
  -h, --help         ${options.help.description} 
  -l, --loglevel     ${options.loglevel.description}
  -v, --version      ${options.version.description}

`;
    this.context.io.printf(usage);
  }

  printVersion(): void {
    this.context.io.println(this.context.config.version);
  }

  static async run(argv: string[]) {
    const cli = new Cli(argv);
    await cli.run();
  }
}
