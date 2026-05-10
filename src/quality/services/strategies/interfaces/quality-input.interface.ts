import type { EvaluationConfig } from '@prompt-optimizer/common-lib/events';

export interface QualityInput {
  actualOutput: string;
  evaluation: EvaluationConfig;
}
