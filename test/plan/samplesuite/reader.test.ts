import assert from 'node:assert/strict';
import test, {suite} from 'node:test';

import {SampleSuiteReader} from '#lib/plan/samplesuite/reader.ts';

await suite('lib/plan/samplesuite/reader', async () => {
  await test('load sample', async () => {
    const reader = new SampleSuiteReader();
    const plan = (await reader.load('samples/sample.config.json')) as any;
    console.error(plan);
    assert.equal(plan.builder, 'SampleSuiteBuilder');
  });
});
