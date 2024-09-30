import type { Context } from "@/cli/context.ts";
import {
  type Plan,
  /* type PlanCallback,*/ PlanRunResults,
} from "@/plan/plan.ts";

export class SampleSuitePlan implements Plan {
  context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  async prepare(): Promise<void> {
    return await new Promise<void>((resolve) => {
      this.context.io.info("prepare plan");
      this.context.io.ok("prepare plan");
      resolve();
    });
  }
  async setup(): Promise<void> {
    return await new Promise<void>((resolve) => {
      this.context.io.info("setup plan");
      this.context.io.ok("setup plan");
      resolve();
    });
  }
  async execute(): Promise<void> {
    return await new Promise<void>((resolve) => {
      this.context.io.info("run plan");
      this.context.io.ok("run plan");
      resolve();
    });
  }
  async cleanup(): Promise<void> {
    return await new Promise<void>((resolve) => {
      this.context.io.info("cleanup plan");
      resolve();
    });
  }

  async run(
    // prepare?: PlanCallback,
    // setup?: PlanCallback,
    // execute?: PlanCallback,
    // cleanup?: PlanCallback,
  ): Promise<PlanRunResults> {
    const result = new PlanRunResults();

    try {
      result.prepareStatus = "started";
      await this.prepare();
      result.prepareStatus = "succeeded";
    } catch (error) {
      result.prepareErrors.push(error as Error);
      // If prepare fails, stop.
      return result;
    }

    try {
      result.setupStatus = "started";
      await this.setup();
      result.setupStatus = "succeeded";
    } catch (error) {
      result.setupErrors.push(error as Error);
      this.context.io.error(error);
    }

    if (result.setupStatus !== "succeeded") {
      result.executeStatus = "skipped";
    } else {
      try {
        result.executeStatus = "started";
        await this.execute();
        await new Promise(() => {
          // simulate something bad
          throw new Error("run failed");
        });
        result.executeStatus = "succeeded";
      } catch (error) {
        result.executeErrors.push(error as Error);
        this.context.io.error(error);
      }
    }

    try {
      result.cleanupStatus = "started";
      this.context.io.pass("cool");
      this.context.io.fail("dang");
      await this.cleanup();
      result.cleanupStatus = "succeeded";
    } catch (error) {
      result.cleanupErrors.push(error as Error);
      this.context.io.error(error);
    }

    return result;
  }
}
