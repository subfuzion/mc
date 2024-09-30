import {
  assert,
  assertStrictEquals as assertEquals,
  assertThrows,
} from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";

import { Args } from "@/cli/args.ts";
import { MockLogger } from "./logger.mock.ts";

describe("args", () => {
  let mockLogger: MockLogger;

  beforeEach(() => {
    mockLogger = new MockLogger();
  });

  it("must not have more than one argument", () => {
    const argv = [".", "foo"];
    assertThrows(() => new Args(argv));
  });

  it("should set loglevel = log", () => {
    const argv = ["--loglevel=log", "."];
    const args = new Args(argv);
    assertEquals(args.options.logLevel, "log");
  });

  it("should log", () => {
    const argv = ["--loglevel=log", "."];
    const args = new Args(argv);
    assertEquals(args.options.logLevel, "log");

    mockLogger.logLevel = args.options.logLevel;
    mockLogger.log("hello");
    assert(mockLogger.stdout.includes("hello"));
  });

  it("should not log", () => {
    const argv = ["--loglevel=log", "."];
    const args = new Args(argv);
    assertEquals(args.options.logLevel, "log");

    mockLogger.logLevel = args.options.logLevel;
    mockLogger.debug("hello");
    assert(!mockLogger.stdout.includes("hello"));
  });

  it("default sample path is cwd", () => {
    const argv = ["."];
    const args = new Args(argv);
    assertEquals(args.positionals.samplePath.name, ".");
  });
});
