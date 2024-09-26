import {readFile} from 'node:fs/promises';

import type {SampleSuitePlan} from './plan.ts';

export class SampleSuiteReader {
  async read(pathname: string): Promise<string> {
    return await readFile(pathname, {encoding: 'utf8'});
  }

  parse(text: string): Promise<SampleSuitePlan> {
    return JSON.parse(text);
  }

  /**
   * Combines the read and parse methods.
   */
  async load(pathname: string): Promise<SampleSuitePlan> {
    const text = await this.read(pathname);
    return this.parse(text);
  }
}
