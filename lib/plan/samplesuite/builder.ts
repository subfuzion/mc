import type {Context} from '#lib/cli/context.ts';
import type {PlanBuilder} from '#lib/plan/builder.ts';
import type {Plan} from '#lib/plan/plan.ts';
import {SampleSuitePlan} from './plan.ts';

export class SampleSuiteBuilder implements PlanBuilder {
  async build(context: Context): Promise<Plan> {
    return new SampleSuitePlan(context);
  }
}
