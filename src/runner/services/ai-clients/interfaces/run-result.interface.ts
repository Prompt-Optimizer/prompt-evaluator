export interface RunResult {
  output: string;
  model: string;
  tokenUsage: {
    input: number;
    output: number;
    cachedInput: number;
  };
  cost: number;
  executionTimeMs: number;
}
