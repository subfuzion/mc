import assert from 'node:assert/strict';
import test, {before, beforeEach, suite} from 'node:test';

import {MockLogger} from '#test/mock/mocklogger.ts';
import {Args} from './args.ts';

await suite('args', async () => {
  let mockLogger: MockLogger;
  let args: Args;

  before(() => {
    mockLogger = new MockLogger();
    args = new Args();
  });

  beforeEach(() => {
    mockLogger.clear();
  });

  await test.skip('must have at least one argument', () => {
    const argv = [];
    assert.throws(() => args.parse(argv));
  });

  await test.skip('must not have more than one argument', () => {
    const argv = ['.', 'foo'];
    assert.throws(() => args.parse(argv));
  });

  await test('should set loglevel = log', () => {
    const argv = ['--loglevel=log', '.'];
    args.parse(argv);
    assert.equal(args.logLevel, 'log');
  });

  await test('should log', () => {
    const argv = ['--loglevel=log', '.'];
    args.parse(argv);
    assert.equal(args.logLevel, 'log');

    mockLogger.logLevel = args.logLevel;
    mockLogger.log('hello');
    assert.ok(mockLogger.stdout.includes('hello'));
  });

  await test('should not log', () => {
    const argv = ['--loglevel=log', '.'];
    args.parse(argv);
    assert.equal(args.logLevel, 'log');

    mockLogger.logLevel = args.logLevel;
    mockLogger.debug('hello');
    assert.ok(!mockLogger.stdout.includes('hello'));
  });

  await test('sample path', () => {
    const argv = ['.'];
    args.parse(argv);
    assert.equal(args.samplePath, '.');
  });
});
