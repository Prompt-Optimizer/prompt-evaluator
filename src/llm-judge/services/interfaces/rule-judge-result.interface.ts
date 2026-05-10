import type { EventMetadata } from '@prompt-optimizer/common-lib/events';

export interface RuleJudgeResult {
  scores: Record<string, number>;
  metadata: EventMetadata;
}
