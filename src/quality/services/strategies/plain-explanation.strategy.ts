import { Injectable } from '@nestjs/common';

import { LlmJudgeClient } from '@app/llm-judge/services';

import type { QualityInput, QualityResult, QualityStrategy } from './interfaces';
import { JUDGE_SYSTEM_PROMPT } from './prompts';

@Injectable()
export class PlainExplanationStrategy implements QualityStrategy {
  constructor(private readonly judgeClient: LlmJudgeClient) {}

  async evaluate(input: QualityInput): Promise<QualityResult> {
    const description = input.evaluation.description ?? 'No description provided';

    const userMessage = [
      '## Expected behavior description:',
      description,
      '',
      '## AI response to evaluate:',
      input.actualOutput,
    ].join('\n');

    const result = await this.judgeClient.judge(JUDGE_SYSTEM_PROMPT, userMessage);

    return {
      quality: result.score,
      metadata: result.metadata,
    };
  }
}
