import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PromptResult, type PromptResultDocument } from '../mongo';

import type { CostMetricsData, EvaluationUpsertData } from './interfaces';

@Injectable()
export class PromptResultRepository {
  constructor(
    @InjectModel(PromptResult.name)
    private readonly model: Model<PromptResultDocument>,
  ) {}

  async upsertEvaluation(promptId: string, data: EvaluationUpsertData): Promise<void> {
    await this.model.collection.updateOne(
      { prompt_id: promptId, evaluation_model: data.evaluationModel },
      {
        $set: {
          prompt_id: promptId,
          run_id: data.runId,
          user_id: data.userId,
          generated_prompt: data.generatedPrompt,
          evaluation_model: data.evaluationModel,
          actual_output: data.actualOutput,
          quality: data.quality,
          generation_metrics: this.toMetricsDoc(data.generationMetrics),
          run_metrics: this.toMetricsDoc(data.runMetrics),
          ...(data.scoringMetrics && { scoring_metrics: this.toMetricsDoc(data.scoringMetrics) }),
        },
      },
      { upsert: true },
    );
  }

  private toMetricsDoc(metrics: CostMetricsData) {
    return {
      token_usage: {
        input: metrics.tokenUsage.input,
        output: metrics.tokenUsage.output,
        cached_input: metrics.tokenUsage.cachedInput,
      },
      cost: metrics.cost,
      execution_time_ms: metrics.executionTimeMs,
    };
  }
}
