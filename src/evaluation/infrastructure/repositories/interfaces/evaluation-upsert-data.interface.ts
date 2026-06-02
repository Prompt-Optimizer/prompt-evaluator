export interface CostMetricsData {
  tokenUsage: { input: number; output: number; cachedInput: number };
  cost: number;
  executionTimeMs: number;
}

export interface EvaluationUpsertData {
  testId: string;
  promptId: string;
  runId: string;
  userId: string;
  generatedPrompt: string;
  evaluationModel: string;
  actualOutput: string;
  quality: number;
  generationMetrics: CostMetricsData;
  runMetrics: CostMetricsData;
  scoringMetrics?: CostMetricsData;
}
