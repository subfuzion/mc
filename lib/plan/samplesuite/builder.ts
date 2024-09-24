import type {PlanBuilder} from '#lib/builder.ts';
import type {Context} from '#lib/context.ts';
import type {Plan} from '#lib/plan.ts';
import {SampleSuitePlan} from './plan.ts';

export class SampleSuiteBuilder implements PlanBuilder {
  async build(context: Context): Promise<Plan> {
    return new SampleSuitePlan(context);
  }
}
