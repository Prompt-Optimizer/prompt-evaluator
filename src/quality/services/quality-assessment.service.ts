import { Injectable, Logger } from '@nestjs/common';
import type { EvaluationConfig } from '@prompt-optimizer/common-lib/events';

import { QualityStrategyFactory } from './quality-strategy.factory';
import type { QualityResult } from './strategies';

@Injectable()
export class QualityAssessmentService {
  private readonly logger = new Logger(QualityAssessmentService.name);

  constructor(private readonly strategyFactory: QualityStrategyFactory) {}

  async assess(actualOutput: string, evaluation: EvaluationConfig): Promise<QualityResult> {
    this.logger.log(`Assessing quality (type=${evaluation.type})`);

    const strategy = this.strategyFactory.get(evaluation.type);

    return strategy.evaluate({ actualOutput, evaluation });
  }
}
