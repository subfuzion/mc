import {
  assert,
  assertNotEquals,
  assertStrictEquals as assertEquals,
} from "@std/assert";
import { describe, it } from "@std/testing/bdd";

import { exec, type ExecCommandResult } from "@/process/exec.ts";

describe("exec", () => {
  it('exec sync "deno --version" should pass', () => {
    const result = exec("deno", ["--version"]) as ExecCommandResult;
    assertEquals(result.command, "deno --version");
    assertEquals(result.exitCode, 0);
    assert(result.stdout.startsWith("deno"));
  });

  it('exec sync "deno --foo" should fail', () => {
    const result = exec("deno", ["--foo"]) as ExecCommandResult;
    assertEquals(result.command, "deno --foo");
    assertNotEquals(result.exitCode, 0);
    assert(result.stderr.includes("unexpected argument"));
  });

  it('exec async "deno --version" should pass', async () => {
    await new Promise<void>((resolve) => {
      exec("deno", ["--version"], {}, (result) => {
        assertEquals(result.command, "deno --version");
        assertEquals(result.exitCode, 0);
        assert(result.stdout.startsWith("deno"));
        resolve();
      });
    });
  });

  it('exec async "deno --foo" should fail', async () => {
    await new Promise<void>((resolve) => {
      exec("deno", ["--foo"], {}, (result) => {
        assertEquals(result.command, "deno --foo");
        assertNotEquals(result.exitCode, 0);
        assert(result.stderr.includes("unexpected argument"));
        resolve();
      });
    });
  });

  it('exec async command "true" should pass', async () => {
    await new Promise<void>((resolve) => {
      exec("true", [], {}, (result) => {
        assertEquals(result.command, "true");
        assertEquals(result.exitCode, 0);
        resolve();
      });
    });
  });

  it('exec async command "false" should fail', async () => {
    await new Promise<void>((resolve) => {
      exec("false", [], {}, (result) => {
        assertEquals(result.command, "false");
        assertNotEquals(result.exitCode, 0);
        resolve();
      });
    });
  });

  it('exec async non-existing command "foo" should fail', async () => {
    await new Promise<void>((resolve) => {
      exec("foo", [], {}, (result) => {
        assertEquals(result.command, "foo");
        assertNotEquals(result.exitCode, 0);
        // NOTE: because the command failed to run (because it doesn't exist), it
        // had no output, so instead of inspecting `result.stderr`, you need to
        // inspect `result.error`.
        // console.error(result.error.toString());
        assert(result.error?.toString().includes("command not found"));
        resolve();
      });
    });
  });
});
