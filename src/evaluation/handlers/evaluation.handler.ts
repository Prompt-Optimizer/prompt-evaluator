import { Injectable, Logger } from '@nestjs/common';
import type { PromptGeneratedEvent } from '@prompt-optimizer/common-lib/events';

import { QualityAssessmentService } from '@app/quality/services';
import { PromptRunnerService } from '@app/runner/services/prompt-runner.service';

import type { CostMetricsData } from '../infrastructure';
import { PromptEvaluationEventPublisher, PromptResultRepository } from '../infrastructure';

const EMPTY_METRICS: CostMetricsData = {
  tokenUsage: { input: 0, output: 0, cachedInput: 0 },
  cost: 0,
  executionTimeMs: 0,
};

@Injectable()
export class EvaluationHandler {
  private readonly logger = new Logger(EvaluationHandler.name);

  constructor(
    private readonly runnerService: PromptRunnerService,
    private readonly qualityService: QualityAssessmentService,
    private readonly repository: PromptResultRepository,
    private readonly eventPublisher: PromptEvaluationEventPublisher,
  ) {}

  async execute(event: PromptGeneratedEvent): Promise<void> {
    this.logger.log(`Evaluating prompt ${event.promptId}`);

    const runResult = await this.runnerService.run(event.generatedPrompt, event.evaluationModel);
    const qualityResult = await this.qualityService.assess(runResult.output, event.evaluation);

    const scoringMetrics: CostMetricsData = qualityResult.metadata
      ? {
          tokenUsage: qualityResult.metadata.tokenUsage,
          cost: qualityResult.metadata.cost,
          executionTimeMs: qualityResult.metadata.executionTimeMs,
        }
      : EMPTY_METRICS;

    await this.repository.upsertEvaluation(event.promptId, {
      runId: event.runId,
      userId: event.userId,
      generatedPrompt: event.generatedPrompt,
      generationModel: event.model,
      evaluationModel: runResult.model,
      actualOutput: runResult.output,
      quality: qualityResult.quality,
      generationMetrics: {
        tokenUsage: event.metadata.tokenUsage,
        cost: event.metadata.cost,
        executionTimeMs: event.metadata.executionTimeMs,
      },
      runMetrics: {
        tokenUsage: runResult.tokenUsage,
        cost: runResult.cost,
        executionTimeMs: runResult.executionTimeMs,
      },
      scoringMetrics,
    });

    this.eventPublisher.publishPromptEvaluated({
      runId: event.runId,
      userId: event.userId,
      timestamp: new Date().toISOString(),
      promptId: event.promptId,
      quality: qualityResult.quality,
      metadata: {
        tokenUsage: runResult.tokenUsage,
        cost: runResult.cost,
        executionTimeMs: runResult.executionTimeMs,
      },
    });

    this.logger.log(`Evaluated prompt ${event.promptId}: quality=${qualityResult.quality.toFixed(3)}`);
  }
}
