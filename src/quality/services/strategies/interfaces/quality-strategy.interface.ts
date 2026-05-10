import type { QualityInput } from './quality-input.interface';
import type { QualityResult } from './quality-result.interface';

export interface QualityStrategy {
  evaluate(input: QualityInput): Promise<QualityResult>;
}
