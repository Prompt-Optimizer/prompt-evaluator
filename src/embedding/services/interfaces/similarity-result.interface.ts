import type { EventMetadata } from '@prompt-optimizer/common-lib/events';

export interface SimilarityResult {
  similarity: number;
  metadata: EventMetadata;
}
