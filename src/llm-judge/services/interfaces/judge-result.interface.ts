import type { EventMetadata } from '@prompt-optimizer/common-lib/events';

export interface JudgeResult {
  score: number;
  metadata: EventMetadata;
}
