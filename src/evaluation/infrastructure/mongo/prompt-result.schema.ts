import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class TokenUsage {
  @Prop({ required: true })
  input: number;

  @Prop({ required: true })
  output: number;

  @Prop({ required: true, default: 0, name: 'cached_input' })
  cachedInput: number;
}

@Schema({ _id: false })
export class CostMetrics {
  @Prop({ type: TokenUsage, required: true, name: 'token_usage' })
  tokenUsage: TokenUsage;

  @Prop({ required: true })
  cost: number;

  @Prop({ required: true, name: 'execution_time_ms' })
  executionTimeMs: number;
}

@Schema({
  collection: 'prompt_results',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class PromptResult {
  @Prop({ required: true, unique: true, index: true, name: 'prompt_id' })
  promptId: string;

  @Prop({ required: true, index: true, name: 'run_id' })
  runId: string;

  @Prop({ required: true, name: 'user_id' })
  userId: string;

  @Prop({ required: true, name: 'generated_prompt' })
  generatedPrompt: string;

  @Prop({ name: 'evaluation_model' })
  evaluationModel?: string;

  @Prop({ name: 'actual_output' })
  actualOutput?: string;

  @Prop()
  quality?: number;

  @Prop({ type: CostMetrics, required: true, name: 'generation_metrics' })
  generationMetrics: CostMetrics;

  @Prop({ type: CostMetrics, name: 'run_metrics' })
  runMetrics?: CostMetrics;

  @Prop({ type: CostMetrics, name: 'scoring_metrics' })
  scoringMetrics?: CostMetrics;
}

export type PromptResultDocument = HydratedDocument<PromptResult>;
export const PromptResultSchema = SchemaFactory.createForClass(PromptResult);

PromptResultSchema.index({ run_id: 1, score: -1 });
