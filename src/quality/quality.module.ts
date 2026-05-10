import { Module } from '@nestjs/common';

import { EmbeddingModule } from '@app/embedding/embedding.module';
import { LlmJudgeModule } from '@app/llm-judge/llm-judge.module';

import {
  BannedWordsAssessor,
  HardOutputStrategy,
  KeywordsAssessor,
  MaxLengthAssessor,
  MinLengthAssessor,
  ParamBuilderStrategy,
  PlainExplanationStrategy,
  QualityAssessmentService,
  QualityStrategyFactory,
  RuleAssessmentService,
} from './services';

@Module({
  imports: [LlmJudgeModule, EmbeddingModule],
  providers: [
    KeywordsAssessor,
    BannedWordsAssessor,
    MinLengthAssessor,
    MaxLengthAssessor,
    RuleAssessmentService,
    PlainExplanationStrategy,
    ParamBuilderStrategy,
    HardOutputStrategy,
    QualityStrategyFactory,
    QualityAssessmentService,
  ],
  exports: [QualityAssessmentService],
})
export class QualityModule {}
