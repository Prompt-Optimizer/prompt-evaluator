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
    await this.model.updateOne({ promptId }, { $set: { promptId, ...data } }, { upsert: true }).exec();
  }
}
