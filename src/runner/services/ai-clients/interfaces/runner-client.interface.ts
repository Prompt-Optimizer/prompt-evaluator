import type { RunResult } from './run-result.interface';

export interface RunnerClient {
  run(prompt: string, model: string): Promise<RunResult>;
}
