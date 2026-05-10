import type { EventMetadata } from '@prompt-optimizer/common-lib/events';

export interface QualityResult {
  quality: number;
  metadata?: EventMetadata;
}
