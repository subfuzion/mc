import type {ExecCommandOptions, ExecCommandResult} from '#lib/process/exec.ts';

export class TaskCommand {
  options: ExecCommandOptions;
  result: ExecCommandResult;
}

/**
 * This is the fundamental unit of work for a plan. Every task runs in its own
 * process. A task can have child tasks.
 */
export interface Task {
  name: string;
  timeout: number;
  retries: number;
  command: TaskCommand;
}
