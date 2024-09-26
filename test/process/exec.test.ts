import assert from 'node:assert/strict';
import test, {suite} from 'node:test';

import {type ExecCommandResult, exec} from '#lib/process/exec.ts';

await suite('exec', async () => {
  test('exec sync "node --version" should pass', () => {
    const result = exec(['--version']) as ExecCommandResult;
    assert.equal(result.command, 'node --version');
    assert.equal(result.exitCode, 0);
    assert.ok(result.stdout.startsWith('v'));
  });

  test('exec sync "node --foo" should fail', () => {
    const result = exec(['--foo']) as ExecCommandResult;
    assert.equal(result.command, 'node --foo');
    assert.notEqual(result.exitCode, 0);
    assert.ok(result.stderr.includes('bad option'));
  });

  test('exec async "node --version" should pass', (_, done) => {
    exec(['--version'], (result) => {
      assert.equal(result.command, 'node --version');
      assert.equal(result.exitCode, 0);
      assert.ok(result.stdout.startsWith('v'));
      done();
    });
  });

  test('exec async "node --foo" should fail', (_, done) => {
    exec(['--foo'], (result) => {
      assert.equal(result.command, 'node --foo');
      assert.notEqual(result.exitCode, 0);
      assert.ok(result.stderr.includes('bad option'));
      done();
    });
  });

  test('exec async command "true" should pass', (_, done) => {
    exec('true', (result) => {
      assert.equal(result.command, 'true');
      assert.equal(result.exitCode, 0);
      done();
    });
  });

  test('exec async command "false" should fail', (_, done) => {
    exec('false', (result) => {
      assert.equal(result.command, 'false');
      assert.notEqual(result.exitCode, 0);
      done();
    });
  });

  test('exec async non-existing command "foo" should fail', (_, done) => {
    exec('foo', (result) => {
      assert.equal(result.command, 'foo');
      assert.notEqual(result.exitCode, 0);
      // NOTE: because the command failed to run (because it doesn't exist), it
      // had no output, so instead of inspecting `result.stderr`, you need to
      // inspect `result.error`.
      // console.error(result.error.toString());
      assert.ok(result.error.toString().includes('command not found'));
      done();
    });
  });
});
