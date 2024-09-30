import type { Context } from "@/cli/context.ts";
import type { Plan } from "./plan.ts";
import { SampleSuiteBuilder } from "@/plan/samplesuite/builder.ts";

// TypeScript enum is not supported in strip-only mode. Symbols aren't strictly
// necessary here, but do make it easier for the caller not to mistake.
export class PlanBuilderType {
  static SampleSuiteBuilder = Symbol("SampleSuiteBuilder");
}

export interface PlanBuilder {
  build(context: Context): Promise<Plan>;
}

export class PlanBuilderFactory {
  static builder(builderType: symbol): PlanBuilder {
    switch (builderType) {
      case PlanBuilderType.SampleSuiteBuilder:
        return new SampleSuiteBuilder();
      default:
        throw new Error(`Unsupported builder type: ${String(builderType)}`);
    }
  }
}
