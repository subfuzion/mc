import {
  DefaultCommand,
  type ExecCommandCallback,
  type ExecCommandOptions,
} from './exec.ts';

type VisitorCallback = (node: SampleNode) => void;

interface VisitorCallbackOptions {
  skip: boolean;
}

interface ExecCommandSpec {
  cmd: string;
  args: string[];
  options: ExecCommandOptions;
  cb: ExecCommandCallback;
}

class SampleNode {
  name: string;
  cmdSpec: ExecCommandSpec;
  children: SampleNode[];
  skip: boolean;

  constructor(
    name: string,
    cmd?: string | string[],
    args?: string[] | ExecCommandOptions,
    options?: ExecCommandOptions | ExecCommandCallback,
    cb?: ExecCommandCallback,
  ) {
    // The cmd is optional, If the first argument looks like the args array,
    // reassign args to parameters on the right and then assign the default cmd.
    if (Array.isArray(cmd)) {
      cb = options as ExecCommandCallback;
      options = args as ExecCommandOptions;
      args = cmd as string[];
      cmd = DefaultCommand;
    }
    // @ts-ignore
    this.cmdSpec = {cmd, args, options, cb};
    this.name = name;
  }

  add(node: SampleNode) {
    if (!this.children) this.children = [];
    this.children.push(node);
    return this;
  }

  /**
   * Perform an in-order traversal of all sample nodes.
   */
  visit(cb: VisitorCallback, options?: VisitorCallbackOptions) {
    const _visit = (node: SampleNode, cb: VisitorCallback) => {
      if (options?.skip && node.skip) return;
      cb(node);
      if (node.children) {
        node.children.forEach((child) => _visit(child, cb));
      }
    };
    _visit(this, cb);
  }
}

// eslint-disable-next-line no-unused-vars
class SampleRunner {
  root: SampleNode;

  constructor(node: SampleNode) {
    this.root = node;
  }

  /**
   * Perform in-order traversal of all sample nodes starting at the root.
   */
  visit(cb: VisitorCallback, options?: VisitorCallbackOptions) {
    if (!this.root) return;
    this.root.visit(cb, options);
  }

  /**
   * Perform in-order traversal of all sample nodes starting at the root.
   */
  run() {
    const visitor: VisitorCallback = (node: SampleNode): void => {
      console.log(node.name);
    };
    this.visit(visitor);
  }
}

const suite = new SampleNode('Sample Suite')
  .add(new SampleNode('subsuite1'))
  .add(new SampleNode('subsuite2'));

const runner = new SampleRunner(suite);
runner.run();
