import type { Context } from "@/cli/context.ts";
import type { PlanBuilder } from "@/plan/builder.ts";
import type { Plan } from "@/plan/plan.ts";
import { SampleSuitePlan } from "@/plan/samplesuite/plan.ts";

export class SampleSuiteBuilder implements PlanBuilder {
  async build(context: Context): Promise<Plan> {
    return await new Promise((resolve) => {
      resolve(new SampleSuitePlan(context));
    });
  }
}
