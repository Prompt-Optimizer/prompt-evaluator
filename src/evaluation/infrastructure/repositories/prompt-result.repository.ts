import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PromptResult, type PromptResultDocument } from '../mongo';

import type { EvaluationUpsertData } from './interfaces';

@Injectable()
export class PromptResultRepository {
  constructor(
    @InjectModel(PromptResult.name)
    private readonly model: Model<PromptResultDocument>,
  ) {}

  async upsertEvaluation(promptId: string, data: EvaluationUpsertData): Promise<void> {
    await this.model.collection.updateOne(
      { prompt_id: promptId },
      {
        $set: {
          prompt_id: promptId,
          run_id: data.runId,
          user_id: data.userId,
          generated_prompt: data.generatedPrompt,
          evaluation_model: data.evaluationModel,
          actual_output: data.actualOutput,
          quality: data.quality,
          generation_metrics: data.generationMetrics,
          run_metrics: data.runMetrics,
          scoring_metrics: data.scoringMetrics,
        },
      },
      { upsert: true },
    );
  }
}
