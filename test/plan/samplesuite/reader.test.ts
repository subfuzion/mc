import { assertStrictEquals as assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

import { SampleSuiteReader } from "@/plan/samplesuite/reader.ts";

describe("lib/plan/samplesuite/reader", () => {
  it("load sample", async () => {
    const reader = new SampleSuiteReader();
    // TODO: replace any with explicit Plan type when ready
    const plan = (await reader.load("samples/sample.config.json")) as any;
    console.log(plan);
    assertEquals(plan.builder, "SampleSuiteBuilder");
  });
});
